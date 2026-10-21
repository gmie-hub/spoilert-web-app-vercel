"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

import useGetEnrolledLearnersQuery from "@spt/hooks/apiRequests/useGetEnrolledLearnersQuery";
import useChatConversation from "@spt/hooks/chat/useChatConversation";
import useChatUser, { useChatParticipant } from "@spt/hooks/chat/useChatUser";
import { LoadingState } from "@spt/screens/main/spoil/preSpoilQuiz/components/LoadingState";

import { ChatFooterNotice, ChatPanel } from "./chatView/ChatPanel";

interface Props {
  spoilId: number;
  enrollmentId: number;
}

// A tutor's 1-on-1 chat with one learner enrolled on their spoil — the same
// conversation the learner sees from "Chat With Tutor" on web or mobile.
export default function ChatView({ spoilId, enrollmentId }: Props) {
  const router = useRouter();
  const { me } = useChatUser();
  const { learners, isLoading, isError, errorMessage } = useGetEnrolledLearnersQuery(spoilId);

  const enrollment = learners.find((item) => item.id === enrollmentId);
  const person =
    enrollment?.learner ??
    enrollment?.user ??
    (enrollment?.user_id ? { id: enrollment.user_id } : null);
  const learner = useChatParticipant(person);
  const chat = useChatConversation(me, learner);

  if (isLoading) return <LoadingState />;

  const enrolledLearnersHref = `/my-spoils/${spoilId}/enrolled-learners`;
  const progressHref = `${enrolledLearnersHref}/${enrollmentId}`;

  let footerNotice = null;
  if (!me) footerNotice = <ChatFooterNotice>Sign in to send messages.</ChatFooterNotice>;
  else if (chat.isSelf) footerNotice = <ChatFooterNotice>You can&apos;t message yourself.</ChatFooterNotice>;

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="md:px-25">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 px-4 py-3 sticky top-0 bg-white z-10 border-b border-[#F1F4F7] flex-wrap">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-[#20262D] hover:opacity-70 transition-opacity"
          >
            <FiArrowLeft size={15} />
            Back
          </button>
          <span className="text-[#C4C4C4]">|</span>
          <nav className="flex items-center gap-1 text-sm flex-wrap">
            <button type="button" onClick={() => router.push("/profile/my-spoils")} className="text-[#0B5368] hover:underline">
              My Spoylz
            </button>
            <span className="text-[#C4C4C4]">/</span>
            <button type="button" onClick={() => router.push(enrolledLearnersHref)} className="text-[#0B5368] hover:underline">
              Enrolled Learners
            </button>
            <span className="text-[#C4C4C4]">/</span>
            <button type="button" onClick={() => router.push(progressHref)} className="text-[#0B5368] hover:underline">
              Learner&apos;s Progress
            </button>
            <span className="text-[#C4C4C4]">/</span>
            <span className="text-[#20262D] font-medium">Chat</span>
          </nav>
        </div>

        {/* Chat card */}
        <div className="px-4 sm:px-6 py-6">
          {learner ? (
            <div className="w-full h-[calc(100svh-160px)] min-h-[460px] border border-[#E9EEF2] rounded-2xl flex flex-col overflow-hidden bg-white">
              <ChatPanel
                key={learner.id}
                chat={chat}
                other={learner}
                footerNotice={footerNotice}
                messagesClassName="px-5 py-6"
              />
            </div>
          ) : (
            <div className="w-full border border-[#E9EEF2] rounded-2xl bg-white px-6 py-16 text-center">
              <p className="text-base font-semibold text-[#20262D]">
                {isError ? "Couldn't load this learner" : "Learner not found"}
              </p>
              <p className="text-sm text-[#8A98A3] mt-2">
                {isError ? errorMessage : "They may no longer be enrolled on this Spoylz."}
              </p>
              <button
                type="button"
                onClick={() => router.push(enrolledLearnersHref)}
                className="mt-6 bg-[#0B5368] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a4a5a] transition-colors"
              >
                Back to Enrolled Learners
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
