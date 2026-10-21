"use client";

import { FiSearch } from "react-icons/fi";

import { ChatAvatar } from "@spt/screens/main/profile/mySpoil/components/chatView/ChatAvatar";

import type { ChatTab, Contact } from "./chatData";

interface Props {
  contacts: Contact[];
  allContactsCount: number;
  selectedContactId: string | null;
  chatTab: ChatTab;
  searchQuery: string;
  unreadCount: number;
  showChat: boolean;
  isLoading?: boolean;
  /** Shown when nothing matches, e.g. why the list is empty. */
  emptyMessage: string;
  onTabChange: (tab: ChatTab) => void;
  onSearchChange: (q: string) => void;
  onContactSelect: (id: string) => void;
  onNewChat: () => void;
}

export function ChatContactList({
  contacts,
  allContactsCount,
  selectedContactId,
  chatTab,
  searchQuery,
  unreadCount,
  showChat,
  isLoading = false,
  emptyMessage,
  onTabChange,
  onSearchChange,
  onContactSelect,
  onNewChat,
}: Props) {
  return (
    <div
      className={`
        flex flex-col border border-[#E9EEF2] rounded-2xl overflow-hidden bg-white
        w-full md:w-[375px] md:flex-shrink-0
        ${showChat ? "hidden md:flex" : "flex"}
      `}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E9EEF2] shrink-0 gap-3">
        <p className="font-bold text-[#20262D] text-base whitespace-nowrap">
          My Chats
        </p>
        <button
          type="button"
          onClick={onNewChat}
          className="flex items-center gap-2 bg-[#0B5368] hover:bg-[#094558] transition-colors text-white px-3 py-[9px] rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span className="w-[18px] h-[18px] rounded-full border-[1.5px] border-white flex items-center justify-center leading-none text-base font-light">
            +
          </span>
          Start A New Chat
        </button>
      </div>

      <div className="flex items-center gap-6 px-5 border-b border-[#E9EEF2] shrink-0">
        {(["all", "unread"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`relative py-3 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              chatTab === tab
                ? "text-[#0B5368]"
                : "text-[#8A98A3] hover:text-[#20262D]"
            }`}
          >
            {tab === "all" ? "All" : "Unread"}
            {tab === "all" && (
              <span className="min-w-[20px] h-5 rounded-full bg-[#0B5368] text-white text-[10px] font-bold flex items-center justify-center px-1">
                {allContactsCount}
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

      <div className="px-4 py-3 shrink-0">
        <label className="flex items-center gap-2 bg-[#F5F6F8] rounded-xl px-3 py-2.5 cursor-text">
          <FiSearch size={15} className="text-[#8A98A3] shrink-0" />
          <input
            type="text"
            placeholder="Search for a user, chat..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-[#8A98A3] text-[#20262D]"
          />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        {isLoading &&
          [0, 1, 2, 3].map((row) => (
            <div key={row} className="flex items-center gap-3 px-5 py-3.5 border-b border-[#F1F4F7]">
              <div className="w-[42px] h-[42px] rounded-full bg-gray-200 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
                <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
          ))}

        {!isLoading && contacts.length === 0 && (
          <p className="text-sm text-[#8A98A3] text-center px-6 py-10 leading-relaxed">
            {emptyMessage}
          </p>
        )}

        {!isLoading &&
          contacts.map((contact) => {
            const isSelected = selectedContactId === contact.id;
            return (
              <button
                key={contact.id}
                type="button"
                onClick={() => onContactSelect(contact.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-left border-b border-[#F1F4F7] last:border-0 transition-colors cursor-pointer ${
                  isSelected ? "bg-[#EBF5F9]" : "hover:bg-[#F8FAFB]"
                }`}
              >
                <ChatAvatar
                  userId={contact.id}
                  name={contact.name}
                  avatar={contact.avatar}
                  size={42}
                  online={contact.online}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-[3px]">
                    <p className="text-[13px] font-semibold text-[#20262D] truncate">
                      {contact.name}
                    </p>
                    <span
                      className={`text-[11px] shrink-0 ${contact.unread > 0 ? "text-[#0B5368] font-semibold" : "text-[#8A98A3]"}`}
                    >
                      {contact.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-[12px] truncate flex-1 leading-relaxed ${contact.unread > 0 ? "text-[#20262D] font-medium" : "text-[#8A98A3]"}`}
                    >
                      {contact.fromMe && (
                        <span className={contact.seen ? "text-[#0B5368]" : "text-[#8A98A3]"}>
                          {contact.seen ? "✓✓ " : "✓ "}
                        </span>
                      )}
                      {contact.lastMessage}
                    </p>
                    {contact.unread > 0 && (
                      <span className="min-w-[20px] h-5 rounded-full bg-[#0B5368] text-white text-[10px] font-bold flex items-center justify-center px-1 shrink-0">
                        {contact.unread > 99 ? "99+" : contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
