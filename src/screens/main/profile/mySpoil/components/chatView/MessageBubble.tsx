import { FiAlertCircle, FiCheck, FiClock } from "react-icons/fi";

import { formatClockTime } from "@spt/utils/chat/format";

import { ChatAvatar } from "./ChatAvatar";
import { MessageContent } from "./MessageContent";

import type { ChatMessage } from "./types";

interface Props {
  msg: ChatMessage;
  other: { id: string; name: string; avatar?: string | null };
  onRetry?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

function StatusIcon({ status }: { status: ChatMessage["status"] }) {
  if (status === "sending") return <FiClock size={11} className="text-[#8A98A3]" aria-label="Sending" />;
  if (status === "failed") return <FiAlertCircle size={12} className="text-red-500" aria-label="Not sent" />;
  if (status === "read") {
    return (
      <span className="flex -space-x-1.5 text-[#0B5368]" aria-label="Read">
        <FiCheck size={12} strokeWidth={3} />
        <FiCheck size={12} strokeWidth={3} />
      </span>
    );
  }
  return <FiCheck size={12} strokeWidth={3} className="text-[#8A98A3]" aria-label="Sent" />;
}

export function MessageBubble({ msg, other, onRetry, onDismiss }: Props) {
  const bubbleClass = msg.fromMe
    ? "bg-[#EBF5F9] rounded-2xl rounded-br-sm"
    : "bg-[#F3F4F6] rounded-2xl rounded-bl-sm";
  const isVisualMedia =
    !msg.isDeleted && Boolean(msg.mediaUrl) && (msg.type === "image" || msg.type === "video");

  return (
    <div className={`flex items-end gap-2 ${msg.fromMe ? "justify-end" : "justify-start"}`}>
      {!msg.fromMe && (
        <ChatAvatar userId={other.id} name={other.name} avatar={other.avatar} size={32} />
      )}

      <div className={`max-w-[75%] sm:max-w-[65%] flex flex-col ${msg.fromMe ? "items-end" : "items-start"}`}>
        <div
          className={`w-fit text-sm text-[#20262D] leading-relaxed ${
            isVisualMedia ? "overflow-hidden rounded-2xl" : `px-4 py-3 ${bubbleClass}`
          }`}
        >
          {msg.replyTo && !msg.isDeleted && (
            <div className="mb-2 border-l-2 border-[#0B5368] bg-white/60 rounded px-2 py-1 text-xs">
              <p className="font-semibold text-[#0B5368]">{msg.replyTo.senderName}</p>
              <p className="text-[#5F6368] line-clamp-2">{msg.replyTo.text}</p>
            </div>
          )}
          <MessageContent msg={msg} />
        </div>

        <div className="flex items-center gap-1 mt-1.5 px-1">
          <span className="text-[10px] text-[#8A98A3]">{formatClockTime(msg.sentAt)}</span>
          {msg.isEdited && !msg.isDeleted && <span className="text-[10px] text-[#8A98A3]">· Edited</span>}
          {msg.fromMe && <StatusIcon status={msg.status} />}
        </div>

        {msg.status === "failed" && (
          <div className="flex items-center gap-3 mt-1 px-1 text-[11px]">
            <span className="text-red-500">Not sent</span>
            <button
              type="button"
              onClick={() => onRetry?.(msg.id)}
              className="font-semibold text-[#0B5368] hover:underline cursor-pointer"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => onDismiss?.(msg.id)}
              className="text-[#8A98A3] hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {msg.fromMe && (
        <div className="w-8 h-8 rounded-full bg-[#E8EEF2] shrink-0 flex items-center justify-center text-[10px] font-semibold text-[#0B5368]">
          Me
        </div>
      )}
    </div>
  );
}
