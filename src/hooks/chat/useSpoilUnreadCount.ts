"use client";

import useGetEnrolledLearnersQuery from "@spt/hooks/apiRequests/useGetEnrolledLearnersQuery";

import useChatUser from "./useChatUser";
import useMyConversations from "./useMyConversations";

/** Unread messages from the learners on one of the tutor's Spoylz, live. */
export default function useSpoilUnreadCount(spoilId: number | string) {
  const { me } = useChatUser();
  const { learners } = useGetEnrolledLearnersQuery(spoilId, Boolean(me));
  const { unreadFrom } = useMyConversations(me?.id);

  const learnerIds = new Set(
    learners
      .map((enrollment) => enrollment.learner?.id ?? enrollment.user?.id ?? enrollment.user_id)
      .filter((id): id is number => id != null),
  );

  return Array.from(learnerIds).reduce((sum, id) => sum + unreadFrom(id), 0);
}
