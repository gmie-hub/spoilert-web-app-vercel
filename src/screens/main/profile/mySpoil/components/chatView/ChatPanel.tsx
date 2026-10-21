"use client";

import { type ReactNode, useState } from "react";

import type useChatConversation from "@spt/hooks/chat/useChatConversation";
import usePresence from "@spt/hooks/chat/usePresence";
import type { ChatParticipant } from "@spt/utils/chat/types";

import { ChatHeader } from "./ChatHeader";
import { ChatInputBar } from "./ChatInputBar";
import { ChatMessageList } from "./ChatMessageList";
import { EmptyState } from "./EmptyState";
import { useRecording } from "./useRecording";

interface Props {
  chat: ReturnType<typeof useChatConversation>;
  other: ChatParticipant;
  headerLeading?: ReactNode;
  headerActions?: ReactNode;
  /** Replaces the input bar, e.g. to explain why this chat can't be used. */
  footerNotice?: ReactNode;
  messagesClassName?: string;
}

/**
 * Header, live thread and composer for one conversation. Render it with
 * `key={other.id}` so switching people starts with an empty composer.
 */
export function ChatPanel({
  chat,
  other,
  headerLeading,
  headerActions,
  footerNotice,
  messagesClassName,
}: Props) {
  const [inputText, setInputText] = useState("");
  const presenceOf = usePresence([other.id]);
  const { online, lastSeen } = presenceOf(other.id);

  const { isRecording, recordingDuration, recordingCancelled, slideOffset, startRecording, stopRecording } =
    useRecording(chat.sendAudio);

  const sendTextMessage = () => {
    if (chat.sendText(inputText)) setInputText("");
  };

  return (
    <>
      <ChatHeader
        userId={other.id}
        name={other.name}
        avatar={other.avatar ?? null}
        online={online}
        lastSeen={lastSeen}
        leading={headerLeading}
        actions={headerActions}
      />

      <ChatMessageList
        key={chat.conversationId ?? "opening"}
        messages={chat.messages}
        other={other}
        isLoading={chat.isLoading}
        error={chat.error}
        hasMore={chat.hasMore}
        onLoadOlder={chat.loadOlder}
        empty={<EmptyState name={other.name} />}
        onRetry={chat.retryUpload}
        onDismiss={chat.dismissUpload}
        className={messagesClassName}
      />

      {footerNotice ?? (
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
          onSendFile={chat.sendFile}
          disabled={!chat.canSend}
        />
      )}
    </>
  );
}

/** A strip in place of the composer explaining why the chat is read-only. */
export function ChatFooterNotice({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-4 border-t border-[#E9EEF2] shrink-0 text-center text-sm text-[#8A98A3]">
      {children}
    </div>
  );
}
