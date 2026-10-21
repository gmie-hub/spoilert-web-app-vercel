"use client";

import { type ReactNode, useState } from "react";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

import useGetLearnerEnrollmentsQuery from "@spt/hooks/apiRequests/useGetLearnerEnrollmentsQuery";
import useGetTutorSpoilChatsQuery from "@spt/hooks/apiRequests/useGetTutorSpoilChatsQuery";
import useChatUser, { toChatParticipant } from "@spt/hooks/chat/useChatUser";
import useMyConversations from "@spt/hooks/chat/useMyConversations";

import { SpoilChatRow, SpoilChatRowSkeleton } from "./SpoilChatRow";

type Tab = "created" | "enrolled";

const newMessagesLabel = (count: number) => `${count} new message${count === 1 ? "" : "s"}`;

// "Spoylz Chats", as on mobile: tutors see the Spoylz they created (opening
// one lists its learners' chats) and the ones they're enrolled on; learners
// only the ones they're enrolled on (opening one chats with its tutor).
export default function SpoilChatsList() {
  const router = useRouter();
  const { me, isTutor } = useChatUser();
  const [chosenTab, setChosenTab] = useState<Tab>("created");
  const activeTab: Tab = isTutor ? chosenTab : "enrolled";

  const { unreadFrom } = useMyConversations(me?.id);
  const created = useGetTutorSpoilChatsQuery(isTutor);
  const enrolled = useGetLearnerEnrollmentsQuery(me?.id ?? "");

  let content: ReactNode;
  if (activeTab === "created") {
    if (created.isLoading) content = <ListSkeleton />;
    else if (created.isError) content = <ListError message={created.errorMessage} />;
    else if (created.spoils.length === 0)
      content = (
        <EmptyState
          title="You Haven't Created Any Spoylz Yet"
          description="Create a Spoylz and your learners' chats will show up here"
          cta="Create A Spoylz"
          onCta={() => router.push("/create-spoils")}
        />
      );
    else
      content = created.spoils.map((spoil) => {
        const learners = spoil.learners ?? [];
        const unread = learners.reduce((sum, learner) => sum + unreadFrom(learner.id), 0);
        const enrolledCount = learners.length || spoil.enrolled_users || 0;
        return (
          <SpoilChatRow
            key={spoil.id}
            title={spoil.title}
            coverImageUrl={spoil.cover_image_url}
            unread={unread}
            subtitle={
              unread > 0
                ? newMessagesLabel(unread)
                : `${enrolledCount} learner${enrolledCount === 1 ? "" : "s"} enrolled`
            }
            onClick={() => router.push(`/messages/${spoil.id}`)}
          />
        );
      });
  } else {
    const spoils = enrolled.enrollments
      .map((enrollment) => enrollment.spoil)
      .filter((spoil, index, all): spoil is NonNullable<typeof spoil> =>
        Boolean(spoil) && all.findIndex((other) => other?.id === spoil?.id) === index,
      );
    if (enrolled.isLoading) content = <ListSkeleton />;
    else if (enrolled.isError) content = <ListError message={enrolled.errorMessage} />;
    else if (spoils.length === 0)
      content = (
        <EmptyState
          title="You Are Not Enrolled to Any Spoylz! 👀"
          description="Enroll in a Spoylz, start learning and access your chats here"
          cta="Explore Spoylz"
          onCta={() => router.push("/categories")}
        />
      );
    else
      content = spoils.map((spoil) => {
        const tutor = spoil.tutor?.id != null ? toChatParticipant({ ...spoil.tutor, id: spoil.tutor.id }) : null;
        const unread = tutor ? unreadFrom(tutor.id) : 0;
        return (
          <SpoilChatRow
            key={spoil.id}
            title={spoil.title ?? "Untitled Spoylz"}
            coverImageUrl={spoil.cover_image_url}
            unread={unread}
            subtitle={
              unread > 0
                ? newMessagesLabel(unread)
                : tutor
                  ? `Tutor: ${tutor.name}`
                  : "Chat with your tutor"
            }
            onClick={() => router.push(`/spoil/${spoil.id}/chat-tutor`)}
          />
        );
      });
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="lg:px-[100px]  px-4 pt-6 pb-5 ">
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-sm text-[#20262D] hover:opacity-70 transition-opacity mb-10"
        >
          <FiArrowLeft size={15} />
          Back
        </button>
      </div>

      <div className="max-w-[960px] w-full mx-auto px-5 pt-6 pb-5 flex flex-col flex-1"></div>
      <div className="max-w-[680px] mx-auto px-6 pt-6 pb-16">
        {/* Title */}
        <h1 className="text-[22px] font-bold text-[#20262D] mb-5">Spoylz Chats</h1>

        {/* Tabs — only tutors have Spoylz of their own */}
        {isTutor && (
          <div className="flex border-b border-[#E9EEF2]">
            {(["created", "enrolled"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setChosenTab(tab)}
                className={`relative flex-1 text-center py-3 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab ? "text-[#0B5368]" : "text-[#8A98A3] hover:text-[#20262D]"
                }`}
              >
                {tab === "created" ? "Spoils Created" : "Spoils Enrolled"}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0B5368]" />
                )}
              </button>
            ))}
          </div>
        )}

        <div className="mt-2">{content}</div>
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div>
      {[0, 1, 2].map((row) => (
        <SpoilChatRowSkeleton key={row} />
      ))}
    </div>
  );
}

function ListError({ message }: { message: string }) {
  return <p className="text-sm text-red-500 text-center py-16">{message}</p>;
}

function EmptyState({
  title,
  description,
  cta,
  onCta,
}: {
  title: string;
  description: string;
  cta: string;
  onCta: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center pt-16 pb-10 gap-6 text-center px-4">
      {/* Illustration */}
      <div className="relative w-[120px] h-[120px]">
        {/* Outer circle */}
        <div className="w-full h-full rounded-full bg-[#F3F4F6] flex items-center justify-center">
          {/* Document shape */}
          <div className="flex flex-col gap-2 items-start px-3">
            <div className="w-12 h-[5px] bg-[#D1D5DB] rounded-full" />
            <div className="w-12 h-[5px] bg-[#D1D5DB] rounded-full" />
            <div className="w-8 h-[5px] bg-[#D1D5DB] rounded-full" />
          </div>
        </div>

        {/* Teal card badge overlay — top-right */}
        <div className="absolute top-1 right-0 w-[52px] h-[30px] bg-[#0B5368] rounded-lg flex items-center gap-1.5 px-2.5 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-white shrink-0" />
          <div className="flex-1 h-[3px] bg-white/50 rounded-full" />
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2">
        <p className="font-bold text-[#20262D] text-base">{title}</p>
        <p className="text-sm text-[#8A98A3] leading-relaxed max-w-[300px] mx-auto">{description}</p>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onCta}
        className="w-full max-w-[340px] bg-[#0B5368] text-white py-4 rounded-2xl font-semibold text-sm hover:bg-[#0a4a5a] transition-colors"
      >
        {cta}
      </button>
    </div>
  );
}
