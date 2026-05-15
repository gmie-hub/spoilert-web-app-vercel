"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

import { ChatInputBar } from "@spt/screens/main/profile/mySpoil/components/chatView/ChatInputBar";
import { MessageBubble } from "@spt/screens/main/profile/mySpoil/components/chatView/MessageBubble";
import { getTime } from "@spt/screens/main/profile/mySpoil/components/chatView/types";
import type { ChatMessage } from "@spt/screens/main/profile/mySpoil/components/chatView/types";
import { useRecording } from "@spt/screens/main/profile/mySpoil/components/chatView/useRecording";

import { Avatar, ChatContactList } from "./ChatContactList";
import { DUMMY_CONTACTS, INITIAL_MESSAGES } from "./chatData";
import StartNewChatModal from "./StartNewChatModal";

import type { ChatTab } from "./chatData";

interface Props {
  spoilId: number;
}

export default function SpoilChatDetail({ spoilId: _spoilId }: Props) {
  const router = useRouter();

  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [chatTab, setChatTab] = useState<ChatTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [allMessages, setAllMessages] =
    useState<Record<number, ChatMessage[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");

  /* Measure this element's top so we can fill exactly the remaining viewport height */
  const outerRef = useRef<HTMLDivElement>(null);
  const [outerHeight, setOuterHeight] = useState<number>(0);

  useEffect(() => {
    const measure = () => {
      if (outerRef.current) {
        const top = outerRef.current.getBoundingClientRect().top;
        setOuterHeight(Math.max(window.innerHeight - top, 300));
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const selectedIdRef = useRef<number | null>(selectedContactId);

  useEffect(() => {
    selectedIdRef.current = selectedContactId;
  }, [selectedContactId]);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 0);
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    const id = selectedIdRef.current;
    if (id === null) return;
    setAllMessages((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), msg] }));
  }, []);

  const {
    isRecording,
    recordingDuration,
    recordingCancelled,
    slideOffset,
    startRecording,
    stopRecording,
  } = useRecording(addMessage, scrollToEnd);

  const selectedContact = selectedContactId !== null
    ? (DUMMY_CONTACTS.find((c) => c.id === selectedContactId) ?? null)
    : null;

  const currentMessages = selectedContactId !== null
    ? (allMessages[selectedContactId] ?? [])
    : [];

  const sendTextMessage = () => {
    if (!inputText.trim() || selectedContactId === null) return;
    addMessage({
      id: Date.now(),
      type: "text",
      text: inputText.trim(),
      fromMe: true,
      time: getTime(),
    });
    setInputText("");
    scrollToEnd();
  };

  const filteredContacts = DUMMY_CONTACTS.filter((c) => {
    const matchesSearch = c.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab = chatTab === "all" || c.unread > 0;
    return matchesSearch && matchesTab;
  });

  const handleContactSelect = (id: number) => {
    setSelectedContactId(id);
    setInputText("");
    setShowChat(true);
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768 && showChat) {
      setShowChat(false);
    } else {
      router.push("/messages");
    }
  };

  const unreadCount = DUMMY_CONTACTS.filter((c) => c.unread > 0).length;

  return (
    /*
     * outerRef measures this div's top position so we can fill exactly
     * the remaining viewport below the sticky site header.
     * overflow-hidden + flex-col lets the panels control their own scroll.
     */
    <div
      ref={outerRef}
      className="flex flex-col bg-white overflow-hidden"
      style={{ height: outerHeight > 0 ? outerHeight : "auto" }}
    >
      {/* Back button — shrink-0, never participates in scrolling */}
      <div className="lg:px-[100px] px-4 pt-5 pb-3 shrink-0">
        <button
          type="button"
          onClick={handleBack}
          className="cursor-pointer flex items-center gap-1.5 text-sm text-[#20262D] hover:opacity-70 transition-opacity"
        >
          <FiArrowLeft size={15} />
          Back
        </button>
      </div>

      {/*
       * flex-1 + min-h-0: takes all remaining height after the back button.
       * min-h-0 overrides the default flex min-height:auto so children can shrink.
       */}
      <div className="max-w-[960px] w-full mx-auto px-5 pb-5 flex flex-col flex-1 min-h-0">
        <div className="flex gap-3 flex-1 min-h-0">

          {/* ── Left panel ──
              ChatContactList is already flex-col + overflow-hidden internally.
              Its contacts div has flex-1 overflow-y-auto → scrolls automatically
              once the panel has a constrained height (which flex stretch gives us here). */}
          <ChatContactList
            contacts={filteredContacts}
            allContactsCount={DUMMY_CONTACTS.length}
            selectedContactId={selectedContactId ?? -1}
            chatTab={chatTab}
            searchQuery={searchQuery}
            unreadCount={unreadCount}
            showChat={showChat}
            onTabChange={setChatTab}
            onSearchChange={setSearchQuery}
            onContactSelect={handleContactSelect}
            onNewChat={() => setShowNewChatModal(true)}
          />

          {/* ── Right panel ──
              min-h-0 lets it shrink within the flex row.
              overflow-hidden clips interior; children control their own scroll.
              Header (shrink-0) sticks at top, input bar (shrink-0) sticks at bottom,
              messages (flex-1 overflow-y-auto) scrolls in between. */}
          <div
            className={`
              flex-1 min-h-0 border border-[#E9EEF2] rounded-2xl flex flex-col overflow-hidden bg-white
              ${showChat ? "flex" : "hidden md:flex"}
            `}
          >
            {selectedContact === null ? (
              /* No conversation selected */
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="relative flex items-end justify-center w-28 h-28">
                  <div className="absolute bottom-0 w-24 h-24 rounded-full bg-[#F3F4F6]" />
                  <div className="relative z-10 mb-3 w-16 h-20 rounded-xl bg-white border border-[#E9EEF2] shadow-sm flex flex-col justify-center gap-2 p-3">
                    <div className="w-full h-2 bg-[#0B5368] rounded-full" />
                    <div className="w-full h-1.5 bg-[#D1D5DB] rounded-full" />
                    <div className="w-3/4 h-1.5 bg-[#D1D5DB] rounded-full" />
                    <div className="w-1/2 h-1.5 bg-[#D1D5DB] rounded-full" />
                  </div>
                </div>
                <p className="text-base font-bold text-[#20262D] mt-1">
                  No Conversation Yet!
                </p>
                <p className="text-sm text-[#8A98A3] max-w-[240px] leading-relaxed">
                  Type in your message to start a conversation
                </p>
              </div>
            ) : (
              <>
                {/* Sticky header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-[#E9EEF2] shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowChat(false)}
                    className="md:hidden text-[#20262D] hover:opacity-70 transition-opacity shrink-0"
                  >
                    <FiArrowLeft size={20} />
                  </button>
                  <Avatar contact={selectedContact} size={44} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#20262D] truncate">
                      {selectedContact.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                      <span className="text-xs text-[#8A98A3]">Online</span>
                    </div>
                  </div>
                </div>

                {/* Date divider — part of the sticky header zone */}
                <div className="flex items-center gap-3 mx-5 mt-5 mb-1 shrink-0">
                  <div className="flex-1 h-px bg-[#E9EEF2]" />
                  <span className="text-[11px] text-[#8A98A3] bg-[#F5F6F8] px-3 py-1 rounded-full font-medium">
                    Today
                  </span>
                  <div className="flex-1 h-px bg-[#E9EEF2]" />
                </div>

                {/* Scrollable messages */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto px-5 py-4"
                >
                  <div className="space-y-5">
                    {currentMessages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        msg={msg}
                        learnerInitial={selectedContact.name[0] ?? "?"}
                      />
                    ))}
                    <div ref={endRef} />
                  </div>
                </div>

                {/* Sticky input bar — ChatInputBar already has shrink-0 + border-t */}
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
              </>
            )}
          </div>

        </div>
      </div>

      {showNewChatModal && (
        <StartNewChatModal onClose={() => setShowNewChatModal(false)} />
      )}
    </div>
  );
}
