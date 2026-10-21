"use client";

import { useMemo } from "react";

import { useAuthStore } from "@spt/store/authStore";
import type { ChatParticipant } from "@spt/utils/chat/types";

interface NamedPerson {
  id: number | string;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  avatar?: string | null;
}

/** How a user appears in chat: institutions by name, people by first + last name. */
export const toChatParticipant = (person: NamedPerson): ChatParticipant => ({
  id: String(person.id),
  name:
    person.name?.trim() ||
    `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim() ||
    person.username ||
    "User",
  avatar: person.avatar ?? null,
});

/**
 * `toChatParticipant`, memoised on the fields that matter — API hooks often
 * hand back fresh objects every render.
 */
export function useChatParticipant(person?: NamedPerson | null) {
  const id = person?.id;
  const name = person?.name;
  const firstName = person?.first_name;
  const lastName = person?.last_name;
  const username = person?.username;
  const avatar = person?.avatar;

  return useMemo(
    () =>
      id == null
        ? null
        : toChatParticipant({
            id,
            name,
            first_name: firstName,
            last_name: lastName,
            username,
            avatar,
          }),
    [id, name, firstName, lastName, username, avatar],
  );
}

/** The signed-in user as a chat participant (null until signed in and hydrated). */
export default function useChatUser() {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  return {
    me: useChatParticipant(user),
    hasHydrated: Boolean(hasHydrated),
    isTutor: user?.role === "tutor",
  };
}
