import { Timestamp, arrayUnion, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

import { getChatDb, getChatStorage } from "@spt/utils/firebase";

import type { MessageDoc, ReplyDoc } from "./types";

// Edit and delete, written exactly as the mobile app's ChatRemoteDataSourceImpl
// writes them. Time limits are in ./rules.

const CONVERSATIONS = "conversations";
const MESSAGES = "messages";

/** What mobile shows in place of a message deleted for everyone. */
export const DELETED_TEXT = "🚫 This message was deleted";

const messageRef = (conversationId: string, messageId: string) =>
  doc(getChatDb(), CONVERSATIONS, conversationId, MESSAGES, messageId);

/** The quoted text a reply carries, worded like mobile's _getReplyText. */
export const getReplyPreview = (message: Pick<MessageDoc, "type" | "text" | "fileName">) => {
  if (message.text) return message.text;
  switch (message.type) {
    case "image":
      return "📷 Photo";
    case "video":
      return "🎥 Video";
    case "audio":
      return "🎵 Audio";
    case "document":
      return `📄 ${message.fileName ?? "Document"}`;
    default:
      return "";
  }
};

export const toReplyDoc = (message: MessageDoc): ReplyDoc => ({
  messageId: message.id,
  text: getReplyPreview(message),
  senderId: message.senderId,
  senderName: message.senderName,
  type: message.type,
});

/** New text for one of my messages; the chat preview follows if it's the latest. */
export async function editChatMessage(
  conversationId: string,
  messageId: string,
  text: string,
  isLatest: boolean,
) {
  const batch = writeBatch(getChatDb());
  batch.update(messageRef(conversationId, messageId), {
    text,
    isEdited: true,
    editedAt: Timestamp.now(),
  });
  if (isLatest) {
    batch.update(doc(getChatDb(), CONVERSATIONS, conversationId), { lastMessage: text });
  }
  await batch.commit();
}

/** Hide a message from this user only. */
export const deleteMessageForUser = (conversationId: string, messageId: string, userId: string) =>
  writeBatch(getChatDb())
    .update(messageRef(conversationId, messageId), { deletedFor: arrayUnion(userId) })
    .commit();

/**
 * Replace a message with the "deleted" notice for both people, and remove its
 * file from Storage so it's really gone.
 */
export async function deleteMessageForEveryone(
  conversationId: string,
  message: MessageDoc,
  userId: string,
  isLatest: boolean,
) {
  const batch = writeBatch(getChatDb());
  batch.update(messageRef(conversationId, message.id), {
    text: DELETED_TEXT,
    mediaUrl: null,
    thumbnailUrl: null,
    fileName: null,
    fileSize: null,
    isDeleted: true,
    deletedAt: serverTimestamp(),
    deletedBy: userId,
  });
  if (isLatest) {
    batch.update(doc(getChatDb(), CONVERSATIONS, conversationId), { lastMessage: DELETED_TEXT });
  }
  await batch.commit();

  for (const url of [message.mediaUrl, message.thumbnailUrl]) {
    if (!url || !/^https?:\/\//i.test(url)) continue;
    // Best effort: the message is already gone even if the file can't be removed.
    await deleteObject(ref(getChatStorage(), url)).catch(() => undefined);
  }
}
