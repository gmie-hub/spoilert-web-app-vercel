"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

import useChatConversation from "@spt/hooks/chat/useChatConversation";
import useChatUser, { useChatParticipant } from "@spt/hooks/chat/useChatUser";
import {
  ChatFooterNotice,
  ChatPanel,
} from "@spt/screens/main/profile/mySpoil/components/chatView/ChatPanel";

import { ChatContactList } from "./ChatContactList";
import StartNewChatModal from "./StartNewChatModal";
import useSpoilChatContacts from "./useSpoilChatContacts";

import type { ChatTab } from "./chatData";

interface Props {
  spoilId: string;
}

// A tutor's chats with the learners on one of their Spoylz — the same
// conversations those learners see from "Chat With Tutor" on web or mobile.
export default function SpoilChatDetail({ spoilId }: Props) {
  const router = useRouter();
  const isValidSpoil = /^\d+$/.test(spoilId);
  const { me } = useChatUser();

  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [chatTab, setChatTab] = useState<ChatTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const { people, contacts, isLoading, error } = useSpoilChatContacts(
    spoilId,
    me?.id ?? null,
    selectedContactId,
    isValidSpoil,
  );
  const selected = useChatParticipant(selectedContactId ? people.get(selectedContactId) : null);
  const chat = useChatConversation(me, selected);

  const term = searchQuery.trim().toLowerCase();
  const filteredContacts = contacts.filter(
    (c) => c.name.toLowerCase().includes(term) && (chatTab === "all" || c.unread > 0),
  );
  const unreadCount = contacts.filter((c) => c.unread > 0).length;

  let emptyMessage = "No chats yet. Use “Start A New Chat” to message a learner on this Spoylz.";
  if (error) emptyMessage = error;
  else if (term) emptyMessage = "No chats match your search.";
  else if (chatTab === "unread") emptyMessage = "You're all caught up.";

  const footerNotice = me ? null : <ChatFooterNotice>Sign in to send messages.</ChatFooterNotice>;

  const handleContactSelect = (id: string) => {
    setSelectedContactId(id);
    setShowChat(true);
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768 && showChat) {
      setShowChat(false);
    } else {
      router.push("/messages");
    }
  };

  if (!isValidSpoil) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-base font-bold text-[#20262D]">Chat not found</p>
        <button
          type="button"
          onClick={() => router.push("/messages")}
          className="bg-[#0B5368] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0a4a5a] transition-colors"
        >
          Go to Spoylz Chats
        </button>
      </div>
    );
  }

  return (
    /*
     * Exactly the window below the sticky site header (which publishes its
     * live height as --site-header-height), so the page itself never scrolls
     * and the chat header stays pinned; only the lists and the thread scroll.
     * dvh follows mobile browser bars as they show and hide.
     */
    <div
      className="flex flex-col bg-white overflow-hidden"
      style={{ height: "calc(100dvh - var(--site-header-height, 64px))" }}
    >
      {/* Back button. On phones an open chat has its own back arrow, so this
          row makes way for the chat. */}
      <div className={`lg:px-[100px] px-4 pt-5 pb-3 shrink-0 ${showChat ? "hidden md:block" : ""}`}>
        <button
          type="button"
          onClick={handleBack}
          className="cursor-pointer flex items-center gap-1.5 text-sm text-[#20262D] hover:opacity-70 transition-opacity"
        >
          <FiArrowLeft size={15} />
          Back
        </button>
      </div>

      <div
        className={`max-w-[960px] w-full mx-auto flex flex-col flex-1 min-h-0 ${
          showChat ? "md:px-5 md:pb-5" : "px-3 pb-3 sm:px-5 sm:pb-5"
        }`}
      >
        <div className="flex gap-3 flex-1 min-h-0">
          <ChatContactList
            contacts={filteredContacts}
            allContactsCount={contacts.length}
            selectedContactId={selectedContactId}
            chatTab={chatTab}
            searchQuery={searchQuery}
            unreadCount={unreadCount}
            showChat={showChat}
            isLoading={isLoading}
            emptyMessage={emptyMessage}
            onTabChange={setChatTab}
            onSearchChange={setSearchQuery}
            onContactSelect={handleContactSelect}
            onNewChat={() => setShowNewChatModal(true)}
          />

          {/* Right panel: header and composer stay put, the thread scrolls between them. */}
          <div
            className={`
              flex-1 min-w-0 min-h-0 md:border md:border-[#E9EEF2] md:rounded-2xl flex-col overflow-hidden bg-white
              ${showChat ? "flex" : "hidden md:flex"}
            `}
          >
            {selected === null ? (
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
                  Pick a chat, or start a new one with a learner
                </p>
              </div>
            ) : (
              <ChatPanel
                key={selected.id}
                chat={chat}
                other={selected}
                footerNotice={footerNotice}
                headerLeading={
                  <button
                    type="button"
                    onClick={() => setShowChat(false)}
                    aria-label="Back to chats"
                    className="md:hidden text-[#20262D] hover:opacity-70 transition-opacity shrink-0"
                  >
                    <FiArrowLeft size={20} />
                  </button>
                }
              />
            )}
          </div>
        </div>
      </div>

      {showNewChatModal && (
        <StartNewChatModal
          contacts={Array.from(people.values())}
          onClose={() => setShowNewChatModal(false)}
          onSelectContact={(contact) => handleContactSelect(contact.id)}
        />
      )}
    </div>
  );
}
