"use client";

import { useEffect, useMemo, useState } from "react";

import { subscribeToConversations } from "@spt/utils/chat/chatService";
import type { ConversationDoc } from "@spt/utils/chat/types";
import { isFirebaseConfigured } from "@spt/utils/firebaseConfig";

const lastActivity = (conversation: ConversationDoc) =>
  (conversation.lastMessageTime ?? conversation.updatedAt)?.toMillis() ?? 0;

/**
 * Every conversation the user is in, live, plus a lookup by the other
 * participant's id — which is how lists find "my chat with this learner".
 */
export default function useMyConversations(userId?: string | null) {
  const [conversations, setConversations] = useState<ConversationDoc[]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !isFirebaseConfigured) return;
    setError(null);
    return subscribeToConversations(
      userId,
      (next) => {
        setConversations(next);
        setLoadedFor(userId);
      },
      () => {
        setError("Couldn't load your chats. Check your connection and try again.");
        setLoadedFor(userId);
      },
    );
  }, [userId]);

  const byOtherUser = useMemo(() => {
    const map = new Map<string, ConversationDoc>();
    if (!userId || loadedFor !== userId) return map;
    conversations
      .filter((conversation) => conversation.participants.length === 2)
      .sort((a, b) => lastActivity(a) - lastActivity(b))
      .forEach((conversation) => {
        const otherId = conversation.participants.find((id) => id !== userId);
        // Sorted oldest first, so the most active thread with a person wins.
        if (otherId) map.set(otherId, conversation);
      });
    return map;
  }, [conversations, loadedFor, userId]);

  const unreadFrom = (otherUserId: string | number) =>
    (userId && byOtherUser.get(String(otherUserId))?.unreadCount?.[userId]) || 0;

  return {
    byOtherUser,
    unreadFrom,
    isLoading: Boolean(userId) && isFirebaseConfigured && loadedFor !== userId,
    error,
  };
}
