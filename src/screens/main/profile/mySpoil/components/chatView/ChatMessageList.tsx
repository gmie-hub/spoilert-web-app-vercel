"use client";

import { Fragment, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

import { formatDayLabel, isSameDay } from "@spt/utils/chat/format";

import { MessageBubble } from "./MessageBubble";
import { messageElementId } from "./types";

import type { MessageMenuActions } from "./MessageMenu";
import type { ChatMessage } from "./types";

interface Props extends MessageMenuActions {
  messages: ChatMessage[];
  other: { id: string; name: string; avatar?: string | null };
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadOlder: () => void;
  /** Shown when the conversation has no messages yet. */
  empty: ReactNode;
  onRetry?: (id: string) => void;
  onDismiss?: (id: string) => void;
  className?: string;
}

// Within this many pixels of the bottom counts as "reading the latest".
const STICKY_THRESHOLD = 120;

function DaySeparator({ date }: { date: Date }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-[#E9EEF2]" />
      <span className="text-[11px] text-[#8A98A3] bg-[#F5F6F8] px-3 py-1 rounded-full font-medium">
        {formatDayLabel(date)}
      </span>
      <div className="flex-1 h-px bg-[#E9EEF2]" />
    </div>
  );
}

/**
 * The scrolling thread. Stays pinned to the newest message while the reader
 * is at the bottom (including as images load), and keeps their place when
 * older messages are loaded above.
 */
export function ChatMessageList({
  messages,
  other,
  isLoading,
  error,
  hasMore,
  onLoadOlder,
  empty,
  onRetry,
  onDismiss,
  onReply,
  onEdit,
  onDelete,
  className = "px-3 py-3 sm:px-5 sm:py-4",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const previousRef = useRef<{ first?: string; last?: string; height: number }>({ height: 0 });
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    if (!highlightedId) return;
    const timer = setTimeout(() => setHighlightedId(null), 1600);
    return () => clearTimeout(timer);
  }, [highlightedId]);

  /** From a reply's quote to the message it quotes. */
  const jumpToMessage = (messageId: string) => {
    const target = document.getElementById(messageElementId(messageId));
    if (!target) {
      toast(hasMore ? "Load earlier messages to see that one." : "That message is no longer here.");
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedId(messageId);
  };

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < STICKY_THRESHOLD;
  };

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const first = messages[0]?.id;
    const last = messages[messages.length - 1]?.id;
    const previous = previousRef.current;

    if (previous.first && previous.last === last && previous.first !== first) {
      // Older messages were added above: keep the reader where they were.
      el.scrollTop += el.scrollHeight - previous.height;
    } else if (last !== previous.last) {
      const newest = messages[messages.length - 1];
      if (!previous.last || stickToBottomRef.current || newest?.fromMe) {
        el.scrollTop = el.scrollHeight;
        stickToBottomRef.current = true;
      }
    }
    previousRef.current = { first, last, height: el.scrollHeight };
  }, [messages]);

  useEffect(() => {
    const el = containerRef.current;
    const content = contentRef.current;
    if (!el || !content || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      if (stickToBottomRef.current) el.scrollTop = el.scrollHeight;
      previousRef.current.height = el.scrollHeight;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  let body: ReactNode;
  if (isLoading) {
    body = (
      <div className="h-full flex items-center justify-center gap-2 text-sm text-[#8A98A3] py-16">
        <FiLoader size={16} className="animate-spin" /> Loading messages…
      </div>
    );
  } else if (error && messages.length === 0) {
    body = <p className="h-full flex items-center justify-center text-sm text-red-500 text-center py-16 px-6">{error}</p>;
  } else if (messages.length === 0) {
    body = empty;
  } else {
    body = (
      <div className="space-y-5">
        {hasMore && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onLoadOlder}
              className="text-xs font-medium text-[#0B5368] bg-[#EBF5F9] hover:bg-[#DDEFF5] px-4 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              Load earlier messages
            </button>
          </div>
        )}
        {messages.map((msg, index) => (
          <Fragment key={msg.id}>
            {(index === 0 || !isSameDay(messages[index - 1].sentAt, msg.sentAt)) && (
              <DaySeparator date={msg.sentAt} />
            )}
            <MessageBubble
              msg={msg}
              other={other}
              onRetry={onRetry}
              onDismiss={onDismiss}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onQuoteClick={jumpToMessage}
              highlighted={highlightedId === msg.id}
            />
          </Fragment>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} onScroll={handleScroll} className={`flex-1 min-h-0 overflow-y-auto ${className}`}>
      <div ref={contentRef} className="min-h-full">
        {body}
      </div>
    </div>
  );
}
