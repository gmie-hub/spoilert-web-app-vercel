"use client";
import React from 'react'
import { useEffect, useRef, useState } from "react";

import { BsCheck2All } from "react-icons/bs";
import { FiMail, FiMessageSquare, FiMic, FiPaperclip, FiPhone, FiSmile } from "react-icons/fi";
import { IoChevronBack } from "react-icons/io5";

type Message = {
  id: number;
  sender: "user" | "admin";
  text: string;
  time: string;
  read?: boolean;
};

// Simulates pre-existing conversation from a prior session.
// In production, initialize from API response.
const MOCK_EXISTING_MESSAGES: Message[] = [
  { id: 1, sender: "user", text: "Good Morning, I have an issue withdrawing my money", time: "10:30 AM", read: true },
  { id: 2, sender: "admin", text: "Good Morning, Please send the details of the transaction.", time: "10:15 AM" },
  { id: 3, sender: "user", text: "Good Morning, I have an issue withdrawing my money", time: "10:30 AM", read: true },
  { id: 4, sender: "admin", text: "Good Morning, Please send the details of the transaction.", time: "10:15 AM" },
  { id: 5, sender: "user", text: "Good Morning, I have an issue withdrawing my money", time: "10:30 AM", read: true },
  { id: 6, sender: "admin", text: "Good Morning, Please send the details of the transaction.", time: "10:15 AM" },
];

const HAS_EXISTING_CONVERSATION = false;

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#EEF3F6] bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#EEF3F6]">
        <Icon className="h-5 w-5 text-[#0B5368]" />
      </div>
      <div>
        <p className="text-[12px] text-[#6B7B8D]">{label}</p>
        <p className="mt-0.5 text-[14px] font-semibold text-[#20262D]">{value}</p>
      </div>
    </div>
  );
}

function DocumentIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="22" width="44" height="52" rx="4" fill="#D1E8EF" />
      <rect x="22" y="16" width="44" height="52" rx="4" fill="#E8F4F7" stroke="#B0D4DF" strokeWidth="1.5" />
      <rect x="30" y="30" width="28" height="4" rx="2" fill="#B0D4DF" />
      <rect x="30" y="39" width="20" height="4" rx="2" fill="#B0D4DF" />
      <rect x="30" y="48" width="24" height="4" rx="2" fill="#B0D4DF" />
    </svg>
  );
}

function AdminAvatar({ size = 36 }: { size?: number }) {
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-full bg-[#CBD5E0] overflow-hidden"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="18" fill="#CBD5E0" />
        <circle cx="18" cy="14" r="6" fill="#8AA0B4" />
        <ellipse cx="18" cy="30" rx="10" ry="7" fill="#8AA0B4" />
      </svg>
    </div>
  );
}

function UserAvatar({ size = 28 }: { size?: number }) {
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-full bg-[#0B5368] overflow-hidden"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="14" fill="#0B5368" />
        <circle cx="14" cy="11" r="5" fill="#7BBDD0" />
        <ellipse cx="14" cy="24" rx="8" ry="6" fill="#7BBDD0" />
      </svg>
    </div>
  );
}

function ChatView({
  messages,
  onBack,
  onSend,
}: {
  messages: Message[];
  onBack: () => void;
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (hasMessages) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, hasMessages]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <div className="flex flex-col h-full rounded-xl border border-[#EEF3F6] bg-white overflow-hidden" style={{ minHeight: 520 }}>
      {/* Header */}
      <div className="flex flex-col border-b border-[#EEF3F6]">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-4 pt-4 pb-2 text-[13px] text-[#0B5368] hover:text-[#094559] w-fit"
        >
          <IoChevronBack className="h-4 w-4" />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-3 px-4 pb-4">
          <div className="relative">
            <AdminAvatar size={40} />
            {!hasMessages && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
            )}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#20262D]">Spoilert Admin</p>
            {hasMessages ? (
              <p className="text-[12px] text-[#6B7B8D]">Last seen 2 hours ago</p>
            ) : (
              <p className="text-[12px] text-green-500">Online</p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
            <DocumentIllustration />
            <p className="text-[16px] font-semibold text-[#20262D]">Start A conversation</p>
            <p className="text-[13px] text-[#6B7B8D] text-center max-w-[260px]">
              This is the beginning of your conversation with Ogunsola Omorinsola
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex justify-center">
              <span className="rounded-full bg-[#F0F4F8] px-4 py-1 text-[12px] text-[#6B7B8D]">Today</span>
            </div>
            {messages.map((msg) =>
              msg.sender === "user" ? (
                <div key={msg.id} className="flex items-end justify-end gap-2">
                  <div className="flex flex-col items-end gap-1 max-w-[65%]">
                    <div className="rounded-2xl rounded-br-sm bg-[#D6EEF5] px-4 py-2.5">
                      <p className="text-[13px] text-[#20262D]">{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-[#6B7B8D]">{msg.time}</span>
                      {msg.read && <BsCheck2All className="h-3.5 w-3.5 text-[#0B5368]" />}
                    </div>
                  </div>
                  <UserAvatar size={28} />
                </div>
              ) : (
                <div key={msg.id} className="flex items-end gap-2">
                  <AdminAvatar size={28} />
                  <div className="flex flex-col gap-1 max-w-[65%]">
                    <div className="rounded-2xl rounded-bl-sm bg-[#F5F7FA] px-4 py-2.5">
                      <p className="text-[13px] text-[#20262D]">{msg.text}</p>
                    </div>
                    <span className="text-[11px] text-[#6B7B8D]">{msg.time}</span>
                  </div>
                </div>
              )
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[#EEF3F6] px-4 py-3">
        <div className="flex items-center gap-2 rounded-full border border-[#EEF3F6] bg-[#F8FAFC] px-4 py-2">
          <button className="text-[#6B7B8D] hover:text-[#0B5368]">
            <FiSmile className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            className="flex-1 bg-transparent text-[13px] text-[#20262D] placeholder-[#A0AEC0] outline-none"
          />
          <button className="text-[#6B7B8D] hover:text-[#0B5368]">
            <FiPaperclip className="h-5 w-5" />
          </button>
          <button className="text-[#6B7B8D] hover:text-[#0B5368]">
            <FiMic className="h-5 w-5" />
          </button>
          <button
            onClick={handleSend}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B5368] text-white hover:bg-[#094559] transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function LiveChatCard({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#EEF3F6] bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#EEF3F6]">
        <FiMessageSquare className="h-5 w-5 text-[#0B5368]" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[12px] text-[#6B7B8D]">Chat With The Admin</p>
        <button
          onClick={onOpen}
          className="w-fit rounded-lg bg-[#0B5368] px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-[#094559] transition-colors"
        >
          Live Chat
        </button>
      </div>
    </div>
  );
}

export default function CustomerSupportPage() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>(
    HAS_EXISTING_CONVERSATION ? MOCK_EXISTING_MESSAGES : []
  );

  function handleSend(text: string) {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text, time, read: false },
    ]);
  }

  if (showChat) {
    return (
      <ChatView
        messages={messages}
        onBack={() => setShowChat(false)}
        onSend={handleSend}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[20px] font-semibold text-[#20262D]">Customer Support</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard icon={FiMail} label="Email" value="spoilert@gmail.com" />
        <InfoCard icon={FiPhone} label="Phone Number" value="(+44)90123456, (+234)812345678" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LiveChatCard onOpen={() => setShowChat(true)} />
      </div>
    </div>
  );
}
