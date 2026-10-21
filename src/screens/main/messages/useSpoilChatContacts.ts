"use client";

import { useMemo } from "react";

import useGetEnrolledLearnersQuery from "@spt/hooks/apiRequests/useGetEnrolledLearnersQuery";
import { toChatParticipant } from "@spt/hooks/chat/useChatUser";
import useMyConversations from "@spt/hooks/chat/useMyConversations";
import usePresence from "@spt/hooks/chat/usePresence";
import { formatListTime } from "@spt/utils/chat/format";
import type { ConversationDoc } from "@spt/utils/chat/types";

import type { Contact } from "./chatData";
import type { ModalContact } from "./StartNewChatModal";

/**
 * Who a tutor can chat with on one Spoylz (everyone enrolled), and the
 * "My Chats" list: the learners they have a conversation with, newest first,
 * plus whoever they've just picked to start one.
 */
export default function useSpoilChatContacts(
  spoilId: string,
  meId: string | null,
  selectedId: string | null,
  enabled = true,
) {
  const { learners, isLoading, isError, errorMessage } = useGetEnrolledLearnersQuery(spoilId, enabled);
  const conversations = useMyConversations(meId);

  // Everyone enrolled, once each, keyed by user id (not enrollment id).
  const people = useMemo(() => {
    const map = new Map<string, ModalContact>();
    learners.forEach((enrollment) => {
      const person =
        enrollment.learner ??
        enrollment.user ??
        (enrollment.user_id ? { id: enrollment.user_id } : null);
      if (!person) return;
      const participant = toChatParticipant(person);
      if (participant.id === meId) return;
      const details = person as { email?: string | null; username?: string | null };
      map.set(participant.id, {
        ...participant,
        email: details.email ?? null,
        username: details.username ?? null,
      });
    });
    return map;
  }, [learners, meId]);

  const chats = useMemo(() => {
    const rows: {
      person: ModalContact;
      conversation: ConversationDoc | undefined;
      lastTime: Date | null;
    }[] = [];
    people.forEach((person, id) => {
      const conversation = conversations.byOtherUser.get(id);
      const lastTime = conversation?.lastMessageTime?.toDate() ?? null;
      if (!lastTime && !conversation?.lastMessage && id !== selectedId) return;
      rows.push({ person, conversation, lastTime });
    });
    // A chat that's just been started (no messages yet) goes on top.
    const sortKey = (row: (typeof rows)[number]) => row.lastTime?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return rows.sort((a, b) => sortKey(b) - sortKey(a));
  }, [people, conversations.byOtherUser, selectedId]);

  const presenceOf = usePresence(chats.map((row) => row.person.id));

  const contacts: Contact[] = chats.map(({ person, conversation, lastTime }) => ({
    id: person.id,
    name: person.name,
    avatar: person.avatar,
    lastMessage: conversation?.lastMessage || "No messages yet",
    time: lastTime ? formatListTime(lastTime) : "",
    unread: (meId && conversation?.unreadCount?.[meId]) || 0,
    online: presenceOf(person.id).online,
    fromMe: Boolean(meId) && conversation?.lastMessageSenderId === meId,
    seen: (conversation?.unreadCount?.[person.id] ?? 0) === 0,
  }));

  return {
    people,
    contacts,
    isLoading: (enabled && isLoading) || conversations.isLoading,
    error: isError ? errorMessage : conversations.error,
  };
}
