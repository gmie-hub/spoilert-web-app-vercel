"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import toast from "react-hot-toast";

import type { ChatMessage } from "@spt/screens/main/profile/mySpoil/components/chatView/types";
import {
  clearConversationForUser,
  findOrCreateConversation,
  markConversationRead,
  sendChatMessage,
  subscribeToMessages,
} from "@spt/utils/chat/chatService";
import type { ChatParticipant, MessageDoc } from "@spt/utils/chat/types";
import { isFirebaseConfigured } from "@spt/utils/firebaseConfig";

import useMediaUploads, { type MediaKind } from "./useMediaUploads";

const PAGE_SIZE = 50;
// Mobile's ChatUtils.isValidMessageText ceiling.
const MAX_TEXT_LENGTH = 4096;

// Mobile writes audio messages with a local file path first and swaps in the
// download URL after uploading, so only http(s) URLs are playable.
const remoteUrl = (url?: string | null) => (url && /^https?:\/\//i.test(url) ? url : undefined);

const toChatMessage = (message: MessageDoc, meId: string, otherId: string): ChatMessage => ({
  id: message.id,
  type: message.type,
  text: message.text ?? undefined,
  mediaUrl: remoteUrl(message.mediaUrl),
  thumbnailUrl: remoteUrl(message.thumbnailUrl),
  duration: message.duration ?? undefined,
  fileName: message.fileName ?? undefined,
  fileSize: message.fileSize ?? undefined,
  fromMe: message.senderId === meId,
  sentAt: message.timestamp?.toDate() ?? new Date(),
  status: message.hasPendingWrites
    ? "sending"
    : message.readBy?.includes(otherId) || message.status === "read"
      ? "read"
      : "sent",
  isEdited: message.isEdited,
  // Mobile's "delete for everyone" keeps the document and swaps the text.
  isDeleted: Boolean(message.isDeleted || message.text?.includes("This message was deleted")),
  replyTo: message.replyTo
    ? { senderName: message.replyTo.senderName, text: message.replyTo.text }
    : null,
});

const audioExtension = (mimeType: string) =>
  mimeType.includes("mp4") ? "m4a" : mimeType.includes("ogg") ? "ogg" : "webm";

/**
 * A live 1-on-1 chat between the signed-in user and `other`, shared with the
 * mobile app: opens (or creates) the conversation, streams its messages,
 * sends text/files/voice notes and keeps read receipts and unread counts.
 */
export default function useChatConversation(me: ChatParticipant | null, other: ChatParticipant | null) {
  const meId = me?.id ?? null;
  const otherId = other?.id ?? null;
  const isSelf = Boolean(meId && meId === otherId);
  const pairKey = meId && otherId ? `${meId}:${otherId}` : "";

  // People are kept in a ref so callbacks always send as/to the current pair.
  const peopleRef = useRef({ me, other });
  useEffect(() => {
    peopleRef.current = { me, other };
  }, [me, other]);

  const [opened, setOpened] = useState({ pairKey: "", id: null as string | null, error: null as string | null });
  const meName = me?.name;
  const meAvatar = me?.avatar;
  const otherName = other?.name;
  const otherAvatar = other?.avatar;

  useEffect(() => {
    if (!meId || !otherId || isSelf || !isFirebaseConfigured) return;
    let cancelled = false;
    const key = `${meId}:${otherId}`;
    findOrCreateConversation(
      { id: meId, name: meName ?? "User", avatar: meAvatar },
      { id: otherId, name: otherName ?? "User", avatar: otherAvatar },
    )
      .then((id) => !cancelled && setOpened({ pairKey: key, id, error: null }))
      .catch(
        () =>
          !cancelled &&
          setOpened({
            pairKey: key,
            id: null,
            error: "Couldn't open this chat. Check your connection and try again.",
          }),
      );
    return () => {
      cancelled = true;
    };
  }, [meId, meName, meAvatar, otherId, otherName, otherAvatar, isSelf]);

  const conversationId = opened.pairKey === pairKey ? opened.id : null;

  const [page, setPage] = useState({ conversationId: "", size: PAGE_SIZE });
  const pageSize = page.conversationId === conversationId ? page.size : PAGE_SIZE;
  const [feed, setFeed] = useState<{
    conversationId: string;
    messages: MessageDoc[];
    error: string | null;
  } | null>(null);

  useEffect(() => {
    if (!conversationId) return;
    return subscribeToMessages(
      conversationId,
      pageSize,
      (messages) => setFeed({ conversationId, messages, error: null }),
      () =>
        setFeed((previous) => ({
          conversationId,
          messages: previous?.conversationId === conversationId ? previous.messages : [],
          error: "Couldn't load messages. Check your connection and try again.",
        })),
    );
  }, [conversationId, pageSize]);

  const loaded = Boolean(conversationId) && feed?.conversationId === conversationId;
  const docs = useMemo(() => (loaded && feed ? feed.messages : []), [loaded, feed]);
  const hasMore = docs.length >= pageSize;

  const loadOlder = useCallback(() => {
    if (conversationId) setPage({ conversationId, size: pageSize + PAGE_SIZE });
  }, [conversationId, pageSize]);

  // Read receipts: whenever the chat is on screen, mark the other person's
  // messages read and reset my unread count (always once per open, so a
  // stale badge clears even when every message is already read).
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const update = () => setIsVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const markedRef = useRef<{ conversationId: string | null; key: string | null }>({
    conversationId: null,
    key: null,
  });
  useEffect(() => {
    if (!conversationId || !meId || !loaded || !isVisible) return;
    const unread = docs
      .filter((message) => message.senderId !== meId && !message.readBy?.includes(meId))
      .map((message) => message.id);
    const key = unread.join(",");
    const firstVisit = markedRef.current.conversationId !== conversationId;
    if (!firstVisit && (!unread.length || markedRef.current.key === key)) return;
    markedRef.current = { conversationId, key };
    markConversationRead(conversationId, meId, unread).catch(() => {
      markedRef.current = { conversationId: null, key: null };
    });
  }, [conversationId, meId, loaded, isVisible, docs]);

  const deliveredIds = useMemo(() => new Set(docs.map((message) => message.id)), [docs]);
  const { send: sendUpload, retry, dismiss, pendingMessages } = useMediaUploads(
    conversationId,
    deliveredIds,
  );

  const messages = useMemo(
    () => [
      ...docs
        .filter((message) => !meId || !message.deletedFor?.includes(meId))
        .map((message) => toChatMessage(message, meId ?? "", otherId ?? "")),
      ...pendingMessages,
    ],
    [docs, meId, otherId, pendingMessages],
  );

  const sendText = useCallback(
    (text: string) => {
      const { me: sender, other: recipient } = peopleRef.current;
      const trimmed = text.trim();
      if (!trimmed || !conversationId || !sender || !recipient) return false;
      if (trimmed.length > MAX_TEXT_LENGTH) {
        toast.error(`Messages can be up to ${MAX_TEXT_LENGTH} characters.`);
        return false;
      }
      sendChatMessage({
        conversationId,
        sender,
        recipientId: recipient.id,
        message: { type: "text", text: trimmed },
      }).catch(() => toast.error("Message not sent. Check your connection and try again."));
      return true;
    },
    [conversationId],
  );

  const sendMedia = useCallback(
    (file: Blob, kind: MediaKind, fileName: string, duration?: number) => {
      const { me: sender, other: recipient } = peopleRef.current;
      if (!conversationId || !sender || !recipient) return;
      void sendUpload({
        conversationId,
        sender,
        recipientId: recipient.id,
        kind,
        file,
        fileName,
        duration,
      });
    },
    [conversationId, sendUpload],
  );

  /** A file from the paperclip menu: photos/videos keep their kind, the rest are documents. */
  const sendFile = useCallback(
    (file: File, picked: "media" | "document") => {
      const kind: MediaKind =
        picked === "document"
          ? "document"
          : file.type.startsWith("video/")
            ? "video"
            : file.type.startsWith("image/")
              ? "image"
              : "document";
      sendMedia(file, kind, file.name, undefined);
    },
    [sendMedia],
  );

  const sendAudio = useCallback(
    (recording: Blob, durationSeconds: number) =>
      sendMedia(
        recording,
        "audio",
        `voice_${Date.now()}.${audioExtension(recording.type)}`,
        Math.max(1, Math.round(durationSeconds)),
      ),
    [sendMedia],
  );

  const clearChat = useCallback(async () => {
    if (!conversationId || !meId) return false;
    try {
      await clearConversationForUser(conversationId, meId);
      await markConversationRead(conversationId, meId, []);
      return true;
    } catch {
      toast.error("Couldn't clear this chat. Check your connection and try again.");
      return false;
    }
  }, [conversationId, meId]);

  const error = !isFirebaseConfigured
    ? "Chat isn't set up on this site yet."
    : (opened.pairKey === pairKey ? opened.error : null) ?? (loaded ? (feed?.error ?? null) : null);

  return {
    conversationId,
    messages,
    isSelf,
    error,
    isLoading: Boolean(pairKey) && !isSelf && !error && !loaded,
    canSend: Boolean(conversationId) && !isSelf && !error,
    hasMore,
    loadOlder,
    sendText,
    sendFile,
    sendAudio,
    retryUpload: retry,
    dismissUpload: dismiss,
    clearChat,
  };
}
