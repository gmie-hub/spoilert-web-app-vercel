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

  const [selectedContactId, setSelectedContactId] = useState(4);
  const [chatTab, setChatTab] = useState<ChatTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [allMessages, setAllMessages] =
    useState<Record<number, ChatMessage[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");

  const endRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const selectedIdRef = useRef(selectedContactId);

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

  const selectedContact =
    DUMMY_CONTACTS.find((c) => c.id === selectedContactId) ??
    DUMMY_CONTACTS[0]!;
  const currentMessages = allMessages[selectedContactId] ?? [];

  const sendTextMessage = () => {
    if (!inputText.trim()) return;
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
    <div
      className="flex flex-col bg-white"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="lg:px-[100px] px-4 pt-6 pb-5">
        <button
          type="button"
          onClick={handleBack}
          className="cursor-pointer flex items-center gap-1.5 text-sm text-[#20262D] hover:opacity-70 transition-opacity mb-10"
        >
          <FiArrowLeft size={15} />
          Backs
        </button>
      </div>

      <div className="max-w-[960px] w-full mx-auto px-5 pt-6 pb-5 flex flex-col flex-1">
        <div className="flex gap-3 flex-1" style={{ minHeight: 540 }}>
          <ChatContactList
            contacts={filteredContacts}
            allContactsCount={DUMMY_CONTACTS.length}
            selectedContactId={selectedContactId}
            chatTab={chatTab}
            searchQuery={searchQuery}
            unreadCount={unreadCount}
            showChat={showChat}
            onTabChange={setChatTab}
            onSearchChange={setSearchQuery}
            onContactSelect={handleContactSelect}
            onNewChat={() => setShowNewChatModal(true)}
          />

          {/* Right panel */}
          <div
            className={`
              flex-1 border border-[#E9EEF2] rounded-2xl flex flex-col overflow-hidden bg-white
              ${showChat ? "flex" : "hidden md:flex"}
            `}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E9EEF2] shrink-0">
              <Avatar contact={selectedContact} size={44} />
              <div>
                <p className="text-sm font-bold text-[#20262D]">
                  {selectedContact.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span className="text-xs text-[#8A98A3]">Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mx-5 mt-5 mb-1 shrink-0">
              <div className="flex-1 h-px bg-[#E9EEF2]" />
              <span className="text-[11px] text-[#8A98A3] bg-[#F5F6F8] px-3 py-1 rounded-full font-medium">
                Today
              </span>
              <div className="flex-1 h-px bg-[#E9EEF2]" />
            </div>

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

      {showNewChatModal && (
        <StartNewChatModal onClose={() => setShowNewChatModal(false)} />
      )}
    </div>
  );
}
