"use client";

import { type ReactNode, useEffect, useState } from "react";

import type useChatConversation from "@spt/hooks/chat/useChatConversation";
import usePresence from "@spt/hooks/chat/usePresence";
import type { ChatParticipant } from "@spt/utils/chat/types";

import { ChatHeader } from "./ChatHeader";
import { ChatInputBar } from "./ChatInputBar";
import { ChatMessageList } from "./ChatMessageList";
import { ComposerBanner } from "./ComposerBanner";
import { DeleteMessageModal } from "./DeleteMessageModal";
import { EmptyState } from "./EmptyState";
import { canEditMessage } from "./types";
import { useRecording } from "./useRecording";

import type { ChatMessage } from "./types";

interface Props {
  chat: ReturnType<typeof useChatConversation>;
  other: ChatParticipant;
  headerLeading?: ReactNode;
  headerActions?: ReactNode;
  /** Replaces the input bar, e.g. to explain why this chat can't be used. */
  footerNotice?: ReactNode;
  messagesClassName?: string;
}

type Composer = { mode: "reply" | "edit"; message: ChatMessage } | null;

/** What a reply/edit strip quotes for a message. */
const quoteOf = (msg: ChatMessage) => {
  if (msg.text) return msg.text;
  if (msg.type === "image") return "📷 Photo";
  if (msg.type === "video") return "🎥 Video";
  if (msg.type === "audio") return "🎵 Audio";
  return `📄 ${msg.fileName ?? "Document"}`;
};

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
  const [composerState, setComposer] = useState<Composer>(null);
  const [deleting, setDeleting] = useState<ChatMessage | null>(null);
  // A message being replied to or edited can disappear (deleted, chat cleared).
  const composer =
    composerState &&
    chat.messages.some((msg) => msg.id === composerState.message.id && !msg.isDeleted)
      ? composerState
      : null;
  const presenceOf = usePresence([other.id]);
  const { online, lastSeen } = presenceOf(other.id);

  const replyToId = composer?.mode === "reply" ? composer.message.id : null;
  const { isRecording, recordingDuration, recordingCancelled, slideOffset, startRecording, stopRecording } =
    useRecording((recording, seconds) => {
      chat.sendAudio(recording, seconds, replyToId);
      if (replyToId) setComposer(null);
    });

  // Let the other person see "recording audio…" while I hold the mic.
  const { setRecording } = chat;
  useEffect(() => setRecording(isRecording), [isRecording, setRecording]);

  const closeComposer = () => {
    if (composer?.mode === "edit") setInputText("");
    setComposer(null);
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    if (composer?.mode === "edit") return;
    if (text.trim()) chat.notifyTyping();
    else chat.stopTyping();
  };

  const handleSend = () => {
    if (composer?.mode === "edit") {
      if (chat.editMessage(composer.message.id, inputText)) {
        setInputText("");
        setComposer(null);
      }
      return;
    }
    if (chat.sendText(inputText, replyToId)) {
      setInputText("");
      setComposer(null);
    }
  };

  const handleSendFile = (file: File, picked: "media" | "document") => {
    chat.sendFile(file, picked, replyToId);
    if (replyToId) setComposer(null);
  };

  const startEdit = (msg: ChatMessage) => {
    if (!canEditMessage(msg)) return;
    setComposer({ mode: "edit", message: msg });
    setInputText(msg.text ?? "");
  };

  const startReply = (msg: ChatMessage) => {
    if (composer?.mode === "edit") setInputText("");
    setComposer({ mode: "reply", message: msg });
  };

  return (
    <>
      <ChatHeader
        userId={other.id}
        name={other.name}
        avatar={other.avatar ?? null}
        online={online}
        lastSeen={lastSeen}
        activity={chat.otherActivity}
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
        onReply={footerNotice ? undefined : startReply}
        onEdit={footerNotice ? undefined : startEdit}
        onDelete={setDeleting}
        className={messagesClassName}
      />

      {footerNotice ?? (
        <ChatInputBar
          inputText={inputText}
          onInputChange={handleInputChange}
          onSendText={handleSend}
          isRecording={isRecording}
          recordingDuration={recordingDuration}
          recordingCancelled={recordingCancelled}
          slideOffset={slideOffset}
          onCancelRecording={() => stopRecording(false)}
          onMicStart={(clientX) => void startRecording(clientX)}
          onSendFile={handleSendFile}
          disabled={!chat.canSend}
          editing={composer?.mode === "edit"}
          onEscape={composer ? closeComposer : undefined}
          focusKey={composer ? `${composer.mode}:${composer.message.id}` : null}
          banner={
            composer && (
              <ComposerBanner
                mode={composer.mode}
                title={composer.message.fromMe ? "yourself" : other.name}
                text={quoteOf(composer.message)}
                onCancel={closeComposer}
              />
            )
          }
        />
      )}

      {deleting && (
        <DeleteMessageModal
          msg={deleting}
          onClose={() => setDeleting(null)}
          onDeleteForMe={() => {
            chat.deleteForMe(deleting.id);
            setDeleting(null);
          }}
          onDeleteForEveryone={() => {
            chat.deleteForEveryone(deleting.id);
            setDeleting(null);
          }}
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
