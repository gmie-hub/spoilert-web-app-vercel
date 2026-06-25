"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";

import ArrowRightIcon from "@spt/assets/icons/arrow-right.svg";
// import CommunityIcon from "@spt/assets/icons/community.svg";
import Button from "@spt/components/button";
import SuccessState from "@spt/components/successState";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";
import { ChatInputBar } from "@spt/screens/main/profile/mySpoil/components/chatView/ChatInputBar";
import { EmptyState } from "@spt/screens/main/profile/mySpoil/components/chatView/EmptyState";
import { MessageBubble } from "@spt/screens/main/profile/mySpoil/components/chatView/MessageBubble";
import { getTime } from "@spt/screens/main/profile/mySpoil/components/chatView/types";
import type { ChatMessage } from "@spt/screens/main/profile/mySpoil/components/chatView/types";
import { useRecording } from "@spt/screens/main/profile/mySpoil/components/chatView/useRecording";
import { LoadingState } from "@spt/screens/main/spoil/preSpoilQuiz/components/LoadingState";

import { ClearChatModal } from "./chatWithTutor/ClearChatModal";
import { ReportConfirmModal, ReportReasonModal } from "./chatWithTutor/ReportModals";
import { TutorProfile } from "./chatWithTutor/TutorProfile";

import type { RelatedSpoilItem } from "./chatWithTutor/RelatedSpoilCard";
import type { ReportStep } from "./chatWithTutor/ReportModals";

type ClearChatStep = "confirm" | "success" | null;

interface Props {
  spoilId: number;
}

export default function ChatWithTutor({ spoilId }: Props) {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [reportStep, setReportStep] = useState<ReportStep>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [clearChatStep, setClearChatStep] = useState<ClearChatStep>(null);

  const { data: spoil, isLoading } = useGetSpoilDetailsQuery(spoilId);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 0);
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const { isRecording, recordingDuration, recordingCancelled, slideOffset, startRecording, stopRecording } =
    useRecording(addMessage, scrollToEnd);

  const sendTextMessage = () => {
    if (!inputText.trim()) return;
    addMessage({ id: Date.now(), type: "text", text: inputText.trim(), fromMe: true, time: getTime() });
    setInputText("");
    scrollToEnd();
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const closeReport = () => { setReportStep(null); setSelectedReason(""); setReportDesc(""); };
  const openReport = () => { setMenuOpen(false); setReportStep("reason"); };

  if (isLoading) return <LoadingState />;
  if (!spoil) return null;

  const tutor = spoil?.tutor;
  const tutorName = `${tutor?.first_name} ${tutor?.last_name}`.trim();
  const tutorAvatar = tutor?.avatar ?? null;
  const tutorInitial = tutorName[0] ?? "T";
  const expertiseList = tutor?.profile?.expertise ?? [];
  const expertise = expertiseList.length > 0 ? expertiseList.join(", ") : null;
  const relatedSpoils: RelatedSpoilItem[] = spoil.related_spoils ?? [];

  return (
    <section className="min-h-screen bg-[#FAFAFA] px-4 py-8 sm:px-6 lg:px-20">
      <div className="mx-auto max-w-[1280px]">

        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#5F6368]">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 font-medium text-[#0C4A5C]"
            >
              <FiArrowLeft size={17} /> Back
            </button>
            <span className="h-5 w-px bg-[#D9D9D9]" />
            <Link href="/" className="underline underline-offset-2">Homepage</Link>
            <span>/</span>
            <Link href={`/spoil/${spoilId}/start`} className="underline underline-offset-2">Spoil Content</Link>
            <span>/</span>
            <span className="text-[#20262D]">Chat With Tutor</span>
          </div>
          <Button
            variant="darkBlue"
            className="gap-2 rounded-[14px] px-5 py-3 text-sm"
            iconRight={<Image src={ArrowRightIcon} alt="" width={16} height={16} />}
            onClick={() => router.push("/community")}
          >
            View Community
          </Button>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left: Tutor profile */}
          <TutorProfile
            tutorId={tutor.id}
            tutorName={tutorName}
            tutorAvatar={tutorAvatar}
            tutorInitial={tutorInitial}
            spoilsCreated={tutor.total_spoils_created ?? null}
            expertise={expertise}
            followersCount={tutor.followers_count ?? null}
            description={tutor?.profile?.bio ?? null}
            relatedSpoils={relatedSpoils}
            onReport={openReport}
          />

          {/* Right: Chat panel */}
          <div className="flex-1 w-full border border-[#E9EEF2] rounded-2xl flex flex-col overflow-hidden bg-white min-h-[calc(100svh-180px)] sm:min-h-[560px] lg:min-h-[calc(100vh-220px)]">

            {/* Chat header */}
            <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5 sm:py-4 border-b border-[#E9EEF2] shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#E8EEF2] flex items-center justify-center shrink-0">
                  {tutorAvatar ? (
                    <Image src={tutorAvatar} alt={tutorName} fill className="object-cover" />
                  ) : (
                    <span className="text-sm font-semibold text-[#0B5368]">{tutorInitial}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#20262D] truncate">{tutorName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0" />
                    <span className="text-xs text-[#8A98A3]">Online</span>
                  </div>
                </div>
              </div>

              {/* 3-dot menu */}
              <div className="relative shrink-0" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className=" cursor-pointer p-2 rounded-full hover:bg-[#F5F6F8] transition-colors text-[#8A98A3] hover:text-[#20262D]"
                >
                  <FiMoreVertical size={18} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-[#F1F4F7] overflow-hidden z-20">
                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); setClearChatStep("confirm"); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#20262D] hover:bg-[#F8FAFB] transition-colors"
                    >
                      <span className="text-[#8A98A3]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </span>
                      Clear Chat
                    </button>
                    <button
                      type="button"
                      onClick={openReport}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-[#F1F4F7]"
                    >
                      <span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                          <line x1="4" y1="22" x2="4" y2="15" />
                        </svg>
                      </span>
                      Report
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
              {messages.length === 0 ? (
                <EmptyState name={tutorName} />
              ) : (
                <div className="space-y-5">
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} msg={msg} learnerInitial={tutorInitial} />
                  ))}
                  <div ref={endRef} />
                </div>
              )}
            </div>

            {/* Input bar */}
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

      {/* ── Clear chat modals ── */}
      {clearChatStep === "confirm" && (
        <ClearChatModal
          onClose={() => setClearChatStep(null)}
          onConfirm={() => { setMessages([]); setClearChatStep("success"); }}
        />
      )}
      {clearChatStep === "success" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setClearChatStep(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-[420px] p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SuccessState
              title="Chat Cleared!"
              description="Your conversation has been cleared successfully."
              buttonLabel="Done"
              onButtonClick={() => setClearChatStep(null)}
            />
          </div>
        </div>
      )}

      {/* ── Report modals ── */}
      {reportStep === "reason" && (
        <ReportReasonModal
          selectedReason={selectedReason}
          description={reportDesc}
          onSelectReason={setSelectedReason}
          onDescriptionChange={setReportDesc}
          onClose={closeReport}
          onSubmit={() => { if (selectedReason) setReportStep("confirm"); }}
        />
      )}
      {reportStep === "confirm" && (
        <ReportConfirmModal
          onClose={closeReport}
          onBack={() => setReportStep("reason")}
          onConfirm={() => setReportStep("success")}
        />
      )}
      {reportStep === "success" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeReport}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-[420px] p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SuccessState
              title="Report Submitted!"
              description="Your report has been submitted successfully and will be reviewed by our team."
              buttonLabel="Done"
              onButtonClick={closeReport}
            />
          </div>
        </div>
      )}
    </section>
  );
}
