"use client";

import { useCallback, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

import useGetEnrolledLearnersQuery, {
  type EnrolledLearner,
} from "@spt/hooks/apiRequests/useGetEnrolledLearnersQuery";
import { LoadingState } from "@spt/screens/main/spoil/preSpoilQuiz/components/LoadingState";

import { ChatHeader } from "./chatView/ChatHeader";
import { ChatInputBar } from "./chatView/ChatInputBar";
import { EmptyState } from "./chatView/EmptyState";
import { MessageBubble } from "./chatView/MessageBubble";
import { getTime } from "./chatView/types";
import { useRecording } from "./chatView/useRecording";

import type { ChatMessage } from "./chatView/types";

const DUMMY_LEARNERS: EnrolledLearner[] = [
  { id: 1, status: "completed", created_at: "2024-11-10", learner: { id: 1, first_name: "Amara", last_name: "Okafor" } },
  { id: 2, status: "ongoing", created_at: "2024-12-01", learner: { id: 2, first_name: "Chidi", last_name: "Nwosu" } },
  { id: 3, status: "not_started", created_at: "2025-01-15", learner: { id: 3, first_name: "Fatima", last_name: "Bello" } },
  { id: 4, status: "ongoing", created_at: "2025-02-03", learner: { id: 4, first_name: "Emeka", last_name: "Adeyemi" } },
  { id: 5, status: "completed", created_at: "2025-03-20", learner: { id: 5, first_name: "Ngozi", last_name: "Eze" } },
  { id: 6, status: "not_started", created_at: "2025-04-05", learner: { id: 6, first_name: "Tunde", last_name: "Akinola" } },
];

const getLearnerName = (learner: EnrolledLearner) => {
  const person = learner.learner ?? learner.user;
  if (!person) return "Unknown Learner";
  return `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim() || "Unknown Learner";
};

const getLearnerAvatar = (learner: EnrolledLearner) =>
  learner.learner?.avatar ?? learner.user?.avatar ?? null;

interface Props {
  spoilId: number;
  enrollmentId: number;
}

export default function ChatView({ spoilId, enrollmentId }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const { isRecording, recordingDuration, recordingCancelled, slideOffset, startRecording, stopRecording } =
    useRecording(addMessage, scrollToEnd);

  const { learners, isLoading } = useGetEnrolledLearnersQuery(spoilId);

  if (isLoading) return <LoadingState />;

  const source = learners.length > 0 ? learners : DUMMY_LEARNERS;
  const learner =
    source.find((l) => l.id === enrollmentId) ??
    source[0] ??
    ({ id: enrollmentId, status: "ongoing", learner: { id: enrollmentId, first_name: "Sample", last_name: "Learner" } } satisfies EnrolledLearner);

  const name = getLearnerName(learner);
  const avatar = getLearnerAvatar(learner);

  const sendTextMessage = () => {
    if (!inputText.trim()) return;
    addMessage({ id: Date.now(), type: "text", text: inputText.trim(), fromMe: true, time: getTime() });
    setInputText("");
    scrollToEnd();
  };

  const enrolledLearnersHref = `/my-spoils/${spoilId}/enrolled-learners`;
  const progressHref = `${enrolledLearnersHref}/${enrollmentId}`;

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
          <div
            className="w-full border border-[#E9EEF2] rounded-2xl flex flex-col overflow-hidden bg-white"
            style={{ minHeight: "calc(100vh - 140px)" }}
          >
            <ChatHeader name={name} avatar={avatar} />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-6">
              {messages.length === 0 ? (
                <EmptyState name={name} />
              ) : (
                <div className="space-y-5">
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} msg={msg} learnerInitial={name[0] ?? "?"} />
                  ))}
                  <div ref={endRef} />
                </div>
              )}
            </div>

            <ChatInputBar
              inputText={inputText}
              onInputChange={setInputText}
              onSendText={sendTextMessage}
              isRecording={isRecording}
              recordingDuration={recordingDuration}
              recordingCancelled={recordingCancelled}
              slideOffset={slideOffset}
              onCancelRecording={() => stopRecording(false)}
              onMicStart={(clientX) => void startRecording(clientX)}
              onAddMessage={addMessage}
              onScrollToEnd={scrollToEnd}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
