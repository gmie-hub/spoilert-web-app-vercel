"use client";

import { useCallback, useEffect, useRef } from "react";

import toast from "react-hot-toast";

import {
  deleteMessageForEveryone,
  deleteMessageForUser,
  editChatMessage,
  toReplyDoc,
} from "@spt/utils/chat/messageActions";
import { DELETE_FOR_EVERYONE_WINDOW_MS, EDIT_WINDOW_MS } from "@spt/utils/chat/rules";
import type { MessageDoc } from "@spt/utils/chat/types";

const MAX_TEXT_LENGTH = 4096;

const ageOf = (message: MessageDoc) =>
  Date.now() - (message.timestamp?.toMillis() ?? Date.now());

const findIn = (docs: MessageDoc[], messageId: string) =>
  docs.find((message) => message.id === messageId);

const isLatestIn = (docs: MessageDoc[], messageId: string) => docs[docs.length - 1]?.id === messageId;

/** Reply, edit and delete for the messages of one conversation. */
export default function useMessageActions(
  conversationId: string | null,
  meId: string | null,
  docs: MessageDoc[],
) {
  // Callbacks read the latest messages without being recreated on every one.
  const docsRef = useRef(docs);
  useEffect(() => {
    docsRef.current = docs;
  }, [docs]);

  /** The quote to attach when answering `messageId`. */
  const replyFor = useCallback((messageId?: string | null) => {
    const message = messageId ? findIn(docsRef.current, messageId) : undefined;
    return message ? toReplyDoc(message) : undefined;
  }, []);

  const editMessage = useCallback(
    (messageId: string, text: string) => {
      const message = findIn(docsRef.current, messageId);
      const trimmed = text.trim();
      if (!conversationId || !message || !trimmed || message.senderId !== meId) return false;
      if (ageOf(message) > EDIT_WINDOW_MS) {
        toast.error("Messages can only be edited within 1 hour 30 minutes of sending.");
        return false;
      }
      if (trimmed.length > MAX_TEXT_LENGTH) {
        toast.error(`Messages can be up to ${MAX_TEXT_LENGTH} characters.`);
        return false;
      }
      if (trimmed === message.text) return true;
      editChatMessage(conversationId, messageId, trimmed, isLatestIn(docsRef.current, messageId)).catch(() =>
        toast.error("Couldn't edit that message. Check your connection and try again."),
      );
      return true;
    },
    [conversationId, meId],
  );

  const deleteForMe = useCallback(
    (messageId: string) => {
      if (!conversationId || !meId) return;
      deleteMessageForUser(conversationId, messageId, meId).catch(() =>
        toast.error("Couldn't delete that message. Check your connection and try again."),
      );
    },
    [conversationId, meId],
  );

  const deleteForEveryone = useCallback(
    (messageId: string) => {
      const message = findIn(docsRef.current, messageId);
      if (!conversationId || !meId || !message || message.senderId !== meId) return;
      if (ageOf(message) > DELETE_FOR_EVERYONE_WINDOW_MS) {
        toast.error("Messages can only be deleted for everyone within 1 hour of sending.");
        return;
      }
      const latest = isLatestIn(docsRef.current, messageId);
      deleteMessageForEveryone(conversationId, message, meId, latest).catch(() =>
        toast.error("Couldn't delete that message. Check your connection and try again."),
      );
    },
    [conversationId, meId],
  );

  return { replyFor, editMessage, deleteForMe, deleteForEveryone };
}
