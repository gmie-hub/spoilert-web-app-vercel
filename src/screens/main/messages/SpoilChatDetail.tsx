"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

import { ChatInputBar } from "@spt/screens/main/profile/mySpoil/components/chatView/ChatInputBar";
import { MessageBubble } from "@spt/screens/main/profile/mySpoil/components/chatView/MessageBubble";
import { getTime } from "@spt/screens/main/profile/mySpoil/components/chatView/types";
import { useRecording } from "@spt/screens/main/profile/mySpoil/components/chatView/useRecording";
import StartNewChatModal from "./StartNewChatModal";

import type { ChatMessage } from "@spt/screens/main/profile/mySpoil/components/chatView/types";

/* ─── Types & Dummy Data ─────────────────────────────────────── */

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  fromMe: boolean;
  avatarBg: string;
}

const DUMMY_CONTACTS: Contact[] = [
  { id: 1, name: "Jade Olasunmbo",     lastMessage: "Good morning sir. It is direct and explanato...", time: "9:41am", unread: 1, online: true,  fromMe: false, avatarBg: "#A8BAC6" },
  { id: 2, name: "Jane Coker",         lastMessage: "I took my pre-spoil quiz and I have to...",        time: "9:41am", unread: 1, online: false, fromMe: false, avatarBg: "#7A9BB2" },
  { id: 3, name: "Bunmi Davies",       lastMessage: "That's good to hear",                               time: "9:41am", unread: 0, online: false, fromMe: true,  avatarBg: "#95A5AE" },
  { id: 4, name: "Ogunsola Omorinsola", lastMessage: "Okay. Have a great day!",                         time: "9:41am", unread: 0, online: false, fromMe: true,  avatarBg: "#7B8F9A" },
  { id: 5, name: "James Fortune",      lastMessage: "My email address is ogunsol...",                   time: "9:41am", unread: 1, online: true,  fromMe: false, avatarBg: "#C9864A" },
  { id: 6, name: "Mory Coco",          lastMessage: "That's good to hear",                              time: "9:41am", unread: 0, online: false, fromMe: true,  avatarBg: "#A0B5C0" },
  { id: 7, name: "Shekinah Glory",     lastMessage: "I still haven't a reply and this...",              time: "9:41am", unread: 1, online: true,  fromMe: false, avatarBg: "#8499A5" },
  { id: 8, name: "Jade Simone",        lastMessage: "Hey, I need help with...",                         time: "9:41am", unread: 0, online: false, fromMe: false, avatarBg: "#9CADB8" },
];

const INITIAL_MESSAGES: Record<number, ChatMessage[]> = {
  4: [
    { id: 1, type: "text", text: "Hi, how are you doing? Just doing a check with my students. How has the Spoil been so far?",                                                fromMe: true,  time: "10:30 AM" },
    { id: 2, type: "text", text: "Good morning sir. It is direct and well explanatory. Kudos to you sir.",                                                                    fromMe: false, time: "10:15 AM" },
    { id: 3, type: "text", text: "That's great to hear. You can always ask questions if you face any difficulty. I'm here to help.",                                           fromMe: true,  time: "10:30 AM" },
    { id: 4, type: "text", text: "Alright sir. But I currently dont have any questions for now. If I have, I'll definitely reach out.Thank you very much sir",               fromMe: false, time: "10:15 AM" },
    { id: 5, type: "text", text: "Okay. Have a great day",                                                                                                                    fromMe: true,  time: "10:30 AM" },
  ],
};

type ChatTab = "all" | "unread";

/* ─── Helpers ─────────────────────────────────────────────────── */

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

/* ─── Sub-components ──────────────────────────────────────────── */

function Avatar({ contact, size = 40 }: { contact: Contact; size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-semibold"
        style={{ backgroundColor: contact.avatarBg }}
      >
        {getInitials(contact.name)}
      </div>
      {contact.online && (
        <span
          className="absolute bottom-0 right-0 rounded-full bg-[#22C55E] border-2 border-white"
          style={{ width: 11, height: 11 }}
        />
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */

interface Props {
  spoilId: number;
}

export default function SpoilChatDetail({ spoilId: _spoilId }: Props) {
  const router = useRouter();

  /* state */
  const [selectedContactId, setSelectedContactId] = useState(4);
  const [chatTab, setChatTab] = useState<ChatTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [allMessages, setAllMessages] = useState<Record<number, ChatMessage[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");

  const endRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const selectedIdRef = useRef(selectedContactId);

  useEffect(() => {
    selectedIdRef.current = selectedContactId;
  }, [selectedContactId]);

  /* callbacks */
  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 0);
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    const id = selectedIdRef.current;
    setAllMessages((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), msg] }));
  }, []);

  const { isRecording, recordingDuration, recordingCancelled, slideOffset, startRecording, stopRecording } =
    useRecording(addMessage, scrollToEnd);

  const selectedContact = DUMMY_CONTACTS.find((c) => c.id === selectedContactId) ?? DUMMY_CONTACTS[0]!;
  const currentMessages = allMessages[selectedContactId] ?? [];

  const sendTextMessage = () => {
    if (!inputText.trim()) return;
    addMessage({ id: Date.now(), type: "text", text: inputText.trim(), fromMe: true, time: getTime() });
    setInputText("");
    scrollToEnd();
  };

  const filteredContacts = DUMMY_CONTACTS.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="flex flex-col bg-white" style={{ minHeight: "calc(100vh - 64px)" }}>
      <div className="max-w-[960px] w-full mx-auto px-5 pt-6 pb-5 flex flex-col flex-1">

        {/* Back */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm text-[#20262D] hover:opacity-70 transition-opacity mb-5 self-start cursor-pointer"
        >
          <FiArrowLeft size={15} />
          Back
        </button>

        {/* Two-panel area */}
        <div className="flex gap-3 flex-1" style={{ minHeight: 540 }}>

          {/* ── LEFT PANEL ── */}
          <div
            className={`
              flex flex-col border border-[#E9EEF2] rounded-2xl overflow-hidden bg-white
              w-full md:w-[375px] md:flex-shrink-0
              ${showChat ? "hidden md:flex" : "flex"}
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E9EEF2] shrink-0 gap-3">
              <p className="font-bold text-[#20262D] text-base whitespace-nowrap">My Chats</p>
              <button
                type="button"
                onClick={() => setShowNewChatModal(true)}
                className="flex items-center gap-2 bg-[#0B5368] hover:bg-[#094558] transition-colors text-white px-3 py-[9px] rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                {/* circle-plus icon */}
                <span className="w-[18px] h-[18px] rounded-full border-[1.5px] border-white flex items-center justify-center leading-none text-base font-light">
                  +
                </span>
                Start A New Chat
              </button>
            </div>

            {/* Tabs: All / Unread */}
            <div className="flex items-center gap-6 px-5 border-b border-[#E9EEF2] shrink-0">
              {(["all", "unread"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setChatTab(tab)}
                  className={`relative py-3 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    chatTab === tab ? "text-[#0B5368]" : "text-[#8A98A3] hover:text-[#20262D]"
                  }`}
                >
                  {tab === "all" ? "All" : "Unread"}
                  {tab === "all" && (
                    <span className="min-w-[20px] h-5 rounded-full bg-[#0B5368] text-white text-[10px] font-bold flex items-center justify-center px-1">
                      {DUMMY_CONTACTS.length}
                    </span>
                  )}
                  {tab === "unread" && unreadCount > 0 && (
                    <span className="min-w-[20px] h-5 rounded-full bg-[#0B5368] text-white text-[10px] font-bold flex items-center justify-center px-1">
                      {unreadCount}
                    </span>
                  )}
                  {chatTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0B5368]" />
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="px-4 py-3 shrink-0">
              <label className="flex items-center gap-2 bg-[#F5F6F8] rounded-xl px-3 py-2.5 cursor-text">
                <FiSearch size={15} className="text-[#8A98A3] shrink-0" />
                <input
                  type="text"
                  placeholder="Search for a user, chat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-[#8A98A3] text-[#20262D]"
                />
              </label>
            </div>

            {/* Contact list */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.map((contact) => {
                const isSelected = selectedContactId === contact.id;
                return (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => handleContactSelect(contact.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 text-left border-b border-[#F1F4F7] last:border-0 transition-colors cursor-pointer ${
                      isSelected ? "bg-[#EBF5F9]" : "hover:bg-[#F8FAFB]"
                    }`}
                  >
                    <Avatar contact={contact} size={42} />

                    <div className="flex-1 min-w-0">
                      {/* Row 1: name + time */}
                      <div className="flex items-center justify-between gap-2 mb-[3px]">
                        <p className="text-[13px] font-semibold text-[#20262D] truncate">{contact.name}</p>
                        <span className="text-[11px] text-[#8A98A3] shrink-0">{contact.time}</span>
                      </div>
                      {/* Row 2: last message + badge */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[12px] text-[#8A98A3] truncate flex-1 leading-relaxed">
                          {contact.fromMe && (
                            <span className="text-[#8A98A3]">✓✓ </span>
                          )}
                          {contact.lastMessage}
                        </p>
                        {contact.unread > 0 && (
                          <span className="min-w-[20px] h-5 rounded-full bg-[#0B5368] text-white text-[10px] font-bold flex items-center justify-center px-1 shrink-0">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div
            className={`
              flex-1 border border-[#E9EEF2] rounded-2xl flex flex-col overflow-hidden bg-white
              ${showChat ? "flex" : "hidden md:flex"}
            `}
          >
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E9EEF2] shrink-0">
              <Avatar contact={selectedContact} size={44} />
              <div>
                <p className="text-sm font-bold text-[#20262D]">{selectedContact.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span className="text-xs text-[#8A98A3]">Online</span>
                </div>
              </div>
            </div>

            {/* "Today" date separator */}
            <div className="flex items-center gap-3 mx-5 mt-5 mb-1 shrink-0">
              <div className="flex-1 h-px bg-[#E9EEF2]" />
              <span className="text-[11px] text-[#8A98A3] bg-[#F5F6F8] px-3 py-1 rounded-full font-medium">
                Today
              </span>
              <div className="flex-1 h-px bg-[#E9EEF2]" />
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-5 py-4">
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

      {/* Start New Chat Modal */}
      {showNewChatModal && (
        <StartNewChatModal onClose={() => setShowNewChatModal(false)} />
      )}
    </div>
  );
}
