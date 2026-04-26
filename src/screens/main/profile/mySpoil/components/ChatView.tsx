"use client";

import React, { useRef, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiMic,
  FiPaperclip,
  FiSend,
  FiSmile,
} from "react-icons/fi";

import useGetEnrolledLearnersQuery, {
  type EnrolledLearner,
} from "@spt/hooks/apiRequests/useGetEnrolledLearnersQuery";
import { LoadingState } from "@spt/screens/main/spoil/preSpoilQuiz/components/LoadingState";

const DUMMY_LEARNERS: EnrolledLearner[] = [
  {
    id: 1,
    status: "completed",
    created_at: "2024-11-10",
    learner: { id: 1, first_name: "Amara", last_name: "Okafor" },
  },
  {
    id: 2,
    status: "ongoing",
    created_at: "2024-12-01",
    learner: { id: 2, first_name: "Chidi", last_name: "Nwosu" },
  },
  {
    id: 3,
    status: "not_started",
    created_at: "2025-01-15",
    learner: { id: 3, first_name: "Fatima", last_name: "Bello" },
  },
  {
    id: 4,
    status: "ongoing",
    created_at: "2025-02-03",
    learner: { id: 4, first_name: "Emeka", last_name: "Adeyemi" },
  },
  {
    id: 5,
    status: "completed",
    created_at: "2025-03-20",
    learner: { id: 5, first_name: "Ngozi", last_name: "Eze" },
  },
  {
    id: 6,
    status: "not_started",
    created_at: "2025-04-05",
    learner: { id: 6, first_name: "Tunde", last_name: "Akinola" },
  },
];

interface ChatMessage {
  id: number;
  text: string;
  fromMe: boolean;
  time: string;
}

interface Props {
  spoilId: number;
  enrollmentId: number;
}

const getLearnerName = (learner: EnrolledLearner) => {
  const person = learner.learner ?? learner.user;
  if (!person) return "Unknown Learner";
  return (
    `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim() ||
    "Unknown Learner"
  );
};

const getLearnerAvatar = (learner: EnrolledLearner) =>
  learner.learner?.avatar ?? learner.user?.avatar ?? null;

export default function ChatView({ spoilId, enrollmentId }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const { learners, isLoading } = useGetEnrolledLearnersQuery(spoilId);

  if (isLoading) return <LoadingState />;

  const source = learners.length > 0 ? learners : DUMMY_LEARNERS;
  const learner =
    source.find((l) => l.id === enrollmentId) ??
    source[0] ??
    ({
      id: enrollmentId,
      status: "ongoing",
      learner: { id: enrollmentId, first_name: "Sample", last_name: "Learner" },
    } satisfies EnrolledLearner);

  const name = getLearnerName(learner);
  const avatar = getLearnerAvatar(learner);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: inputText.trim(), fromMe: true, time },
    ]);
    setInputText("");
    setTimeout(
      () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  };

  const enrolledLearnersHref = `/my-spoils/${spoilId}/enrolled-learners`;
  const progressHref = `${enrolledLearnersHref}/${enrollmentId}`;

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="md:px-25">
        {" "}
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
            <button
              type="button"
              onClick={() => router.push("/profile/my-spoils")}
              className="text-[#0B5368] hover:underline"
            >
              My Spoils
            </button>
            <span className="text-[#C4C4C4]">/</span>
            <button
              type="button"
              onClick={() => router.push(enrolledLearnersHref)}
              className="text-[#0B5368] hover:underline"
            >
              Enrolled Learners
            </button>
            <span className="text-[#C4C4C4]">/</span>
            <button
              type="button"
              onClick={() => router.push(progressHref)}
              className="text-[#0B5368] hover:underline"
            >
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
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E9EEF2] shrink-0">
              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#E8EEF2] shrink-0">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-sm font-semibold text-[#0B5368]">
                    {name[0] ?? "?"}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#20262D]">{name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  <span className="text-xs text-[#8A98A3]">Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
                  <div className="relative flex items-end justify-center w-24 h-24">
                    <div className="absolute bottom-0 w-20 h-20 rounded-full bg-[#F3F4F6]" />
                    <div className="relative z-10 mb-4 w-14 h-16 rounded-xl bg-[#0B5368] flex flex-col justify-center gap-2 p-3 shadow-md">
                      <div className="w-full h-2 bg-white/80 rounded-full" />
                      <div className="w-full h-1.5 bg-white/50 rounded-full" />
                      <div className="w-3/4 h-1.5 bg-white/50 rounded-full" />
                    </div>
                  </div>
                  <p className="text-base font-semibold text-[#20262D]">
                    Start A conversation
                  </p>
                  <p className="text-sm text-[#8A98A3] text-center max-w-[280px] leading-relaxed">
                    This is the beginning of your conversation with {name}
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${msg.fromMe ? "justify-end" : "justify-start"}`}
                    >
                      {!msg.fromMe && (
                        <div className="w-8 h-8 rounded-full bg-[#E8EEF2] shrink-0 flex items-center justify-center text-xs font-semibold text-[#0B5368]">
                          {name[0] ?? "?"}
                        </div>
                      )}
                      <div
                        className={`max-w-[65%] flex flex-col ${msg.fromMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`px-4 py-3 text-sm text-[#20262D] leading-relaxed ${
                            msg.fromMe
                              ? "bg-[#EBF5F9] rounded-2xl rounded-br-sm"
                              : "bg-[#F3F4F6] rounded-2xl rounded-bl-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <div className="flex items-center gap-1 mt-1 px-1">
                          <span className="text-[10px] text-[#8A98A3]">
                            {msg.time}
                          </span>
                          {msg.fromMe && (
                            <span className="text-[10px] text-[#0B5368] font-semibold tracking-tighter">
                              ✓✓
                            </span>
                          )}
                        </div>
                      </div>
                      {msg.fromMe && (
                        <div className="w-8 h-8 rounded-full bg-[#E8EEF2] shrink-0 flex items-center justify-center text-[10px] font-semibold text-[#0B5368]">
                          Me
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 border-t border-[#E9EEF2] shrink-0">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2">
                <button
                  type="button"
                  className="text-[#8A98A3] hover:text-[#20262D] shrink-0"
                >
                  <FiSmile size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Send a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  className="flex-1 text-sm outline-none bg-transparent placeholder:text-[#8A98A3] text-[#20262D]"
                />
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    className="text-[#8A98A3] hover:text-[#20262D]"
                  >
                    <FiPaperclip size={18} />
                  </button>
                  <button
                    type="button"
                    className="text-[#8A98A3] hover:text-[#20262D]"
                  >
                    <FiMic size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={sendMessage}
                    className="w-9 h-9 rounded-full bg-[#0B5368] flex items-center justify-center text-white hover:bg-[#0a4a5a] transition-colors"
                  >
                    <FiSend size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
