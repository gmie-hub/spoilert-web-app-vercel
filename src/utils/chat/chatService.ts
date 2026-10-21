import {
  type DocumentSnapshot,
  Timestamp,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { getChatDb, getChatStorage } from "@spt/utils/firebase";

import { generateConversationId } from "./conversationId";

import type {
  ChatMessageKind,
  ChatParticipant,
  ConversationDoc,
  MessageDoc,
  OutgoingMessage,
} from "./types";

// Firestore reads/writes for chat. Everything here mirrors the mobile app's
// ChatRemoteDataSourceImpl so both platforms read each other's data.

const CONVERSATIONS = "conversations";
const MESSAGES = "messages";
// Firestore rejects batches over 500 writes.
const BATCH_LIMIT = 450;

const toConversation = (snap: DocumentSnapshot): ConversationDoc => {
  const data = snap.data({ serverTimestamps: "estimate" }) ?? {};
  return {
    ...data,
    id: snap.id,
    participants: data.participants ?? [],
    participantNames: data.participantNames ?? {},
    participantAvatars: data.participantAvatars ?? {},
    unreadCount: data.unreadCount ?? {},
  } as ConversationDoc;
};

const toMessage = (snap: DocumentSnapshot): MessageDoc => {
  const data = snap.data({ serverTimestamps: "estimate" }) ?? {};
  return {
    ...data,
    id: snap.id,
    senderId: String(data.senderId ?? ""),
    senderName: data.senderName ?? "",
    type: (data.type ?? "text") as ChatMessageKind,
    readBy: data.readBy ?? [],
    deletedFor: data.deletedFor ?? [],
    hasPendingWrites: snap.metadata.hasPendingWrites,
  } as MessageDoc;
};

/** The conversation-list preview, worded exactly like MessageEntity.displayText. */
export const getMessagePreview = (message: OutgoingMessage) => {
  switch (message.type) {
    case "image":
      return "📷 Image";
    case "video":
      return "🎥 Video";
    case "audio":
      return "🎵 Audio message";
    case "document":
      return `📄 ${message.fileName ?? "Document"}`;
    default:
      return message.text ?? "";
  }
};

/**
 * The id of the 1-on-1 conversation between two users, creating it if neither
 * platform has yet. Same rules as the mobile ConversationRepository: reuse any
 * existing two-person conversation, otherwise create one under the shared id.
 */
export async function findOrCreateConversation(
  me: ChatParticipant,
  other: ChatParticipant,
): Promise<string> {
  const db = getChatDb();
  const conversationId = generateConversationId(me.id, other.id);
  const conversationRef = doc(db, CONVERSATIONS, conversationId);

  if ((await getDoc(conversationRef)).exists()) return conversationId;

  const mine = await getDocs(
    query(collection(db, CONVERSATIONS), where("participants", "array-contains", me.id)),
  );
  const existing = mine.docs.find((snap) => {
    const participants: string[] = snap.data().participants ?? [];
    return participants.length === 2 && participants.includes(other.id);
  });
  if (existing) return existing.id;

  await runTransaction(db, async (transaction) => {
    if ((await transaction.get(conversationRef)).exists()) return;
    const now = Timestamp.now();
    transaction.set(conversationRef, {
      participants: [me.id, other.id],
      participantNames: { [me.id]: me.name, [other.id]: other.name },
      participantAvatars: { [me.id]: me.avatar ?? null, [other.id]: other.avatar ?? null },
      unreadCount: { [me.id]: 0, [other.id]: 0 },
      createdAt: now,
      updatedAt: now,
    });
  });

  return conversationId;
}

/** A fresh message id, so media can be uploaded under it before the message exists. */
export const newMessageId = (conversationId: string) =>
  doc(collection(getChatDb(), CONVERSATIONS, conversationId, MESSAGES)).id;

/**
 * Write a message and bump the conversation's preview and the recipient's
 * unread count in one batch.
 */
export async function sendChatMessage({
  conversationId,
  sender,
  recipientId,
  message,
  messageId = newMessageId(conversationId),
}: {
  conversationId: string;
  sender: ChatParticipant;
  recipientId: string;
  message: OutgoingMessage;
  messageId?: string;
}) {
  const db = getChatDb();
  const timestamp = Timestamp.now();
  const batch = writeBatch(db);

  const optionalFields = Object.fromEntries(
    Object.entries({
      text: message.text,
      mediaUrl: message.mediaUrl,
      thumbnailUrl: message.thumbnailUrl,
      duration: message.duration,
      fileName: message.fileName,
      fileSize: message.fileSize,
    }).filter(([, value]) => value !== undefined),
  );

  batch.set(doc(db, CONVERSATIONS, conversationId, MESSAGES, messageId), {
    senderId: sender.id,
    senderName: sender.name,
    type: message.type,
    timestamp,
    status: "sent",
    readBy: [],
    isEdited: false,
    deletedFor: [],
    ...optionalFields,
  });

  batch.update(doc(db, CONVERSATIONS, conversationId), {
    lastMessage: getMessagePreview(message),
    lastMessageType: message.type,
    lastMessageTime: timestamp,
    lastMessageSenderId: sender.id,
    updatedAt: serverTimestamp(),
    [`unreadCount.${recipientId}`]: increment(1),
  });

  await batch.commit();
  return messageId;
}

const MEDIA_FOLDERS: Record<ChatMessageKind, string> = {
  image: "images",
  video: "videos",
  audio: "audio",
  document: "documents",
  text: "files",
};

/** Upload to the same Storage layout the mobile MediaUploadService uses. */
export function uploadChatMedia({
  conversationId,
  messageId,
  file,
  kind,
  fileName,
  onProgress,
}: {
  conversationId: string;
  messageId: string;
  file: Blob;
  kind: ChatMessageKind;
  fileName: string;
  onProgress?: (progress: number) => void;
}): Promise<string> {
  const extension = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")) : "";
  const path = `chat_media/${conversationId}/${MEDIA_FOLDERS[kind]}/${messageId}_${Date.now()}${extension}`;
  const task = uploadBytesResumable(ref(getChatStorage(), path), file, {
    contentType: file.type || undefined,
    customMetadata: {
      conversationId,
      messageId,
      fileType: kind,
      originalName: fileName,
      uploadTime: new Date().toISOString(),
    },
  });

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) =>
        onProgress?.(snapshot.totalBytes ? snapshot.bytesTransferred / snapshot.totalBytes : 0),
      reject,
      () => {
        getDownloadURL(task.snapshot.ref).then(resolve, reject);
      },
    );
  });
}

/** Newest `count` messages, oldest first, live. */
export function subscribeToMessages(
  conversationId: string,
  count: number,
  onChange: (messages: MessageDoc[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    query(
      collection(getChatDb(), CONVERSATIONS, conversationId, MESSAGES),
      orderBy("timestamp", "desc"),
      limit(count),
    ),
    { includeMetadataChanges: true },
    (snapshot) => onChange(snapshot.docs.map(toMessage).reverse()),
    onError,
  );
}

/** Every conversation the user is part of, live. */
export function subscribeToConversations(
  userId: string,
  onChange: (conversations: ConversationDoc[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    query(
      collection(getChatDb(), CONVERSATIONS),
      where("participants", "array-contains", userId),
      limit(300),
    ),
    (snapshot) => onChange(snapshot.docs.map(toConversation)),
    onError,
  );
}

const commitInChunks = async (
  refs: { path: string }[],
  data: Record<string, unknown>,
) => {
  const db = getChatDb();
  for (let start = 0; start < refs.length; start += BATCH_LIMIT) {
    const batch = writeBatch(db);
    refs.slice(start, start + BATCH_LIMIT).forEach(({ path }) => batch.update(doc(db, path), data));
    await batch.commit();
  }
};

/** Read receipts for the other person's messages, and clear my unread badge. */
export async function markConversationRead(
  conversationId: string,
  userId: string,
  unreadMessageIds: string[],
) {
  await commitInChunks(
    unreadMessageIds.map((id) => ({ path: `${CONVERSATIONS}/${conversationId}/${MESSAGES}/${id}` })),
    { readBy: arrayUnion(userId), status: "read" },
  );
  await updateDoc(doc(getChatDb(), CONVERSATIONS, conversationId), {
    [`unreadCount.${userId}`]: 0,
  });
}

/** "Clear chat": hide every message from this user only, like mobile's delete-for-me. */
export async function clearConversationForUser(conversationId: string, userId: string) {
  const db = getChatDb();
  const snapshot = await getDocs(collection(db, CONVERSATIONS, conversationId, MESSAGES));
  const visible = snapshot.docs.filter(
    (snap) => !((snap.data().deletedFor ?? []) as string[]).includes(userId),
  );
  await commitInChunks(
    visible.map((snap) => ({ path: snap.ref.path })),
    { deletedFor: arrayUnion(userId) },
  );
}
