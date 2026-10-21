"use client";

import { useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";
import { FiChevronDown, FiCopy, FiCornerUpLeft, FiEdit2, FiTrash2 } from "react-icons/fi";

import { canEditMessage } from "./types";

import type { ChatMessage } from "./types";

export interface MessageMenuActions {
  onReply?: (msg: ChatMessage) => void;
  onEdit?: (msg: ChatMessage) => void;
  onDelete?: (msg: ChatMessage) => void;
}

/** The small menu on each message (shown on hover, or always on touch screens). */
export function MessageMenu({ msg, onReply, onEdit, onDelete }: MessageMenuActions & { msg: ChatMessage }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const canCopy = msg.type === "text" && !msg.isDeleted && Boolean(msg.text);
  const items = [
    !msg.isDeleted && onReply && { label: "Reply", icon: FiCornerUpLeft, run: () => onReply(msg) },
    canCopy && {
      label: "Copy",
      icon: FiCopy,
      run: () =>
        navigator.clipboard
          .writeText(msg.text ?? "")
          .then(() => toast.success("Copied"), () => toast.error("Couldn't copy that message.")),
    },
    canEditMessage(msg) && onEdit && { label: "Edit", icon: FiEdit2, run: () => onEdit(msg) },
    onDelete && { label: "Delete", icon: FiTrash2, run: () => onDelete(msg), danger: true },
  ].filter(Boolean) as { label: string; icon: typeof FiCopy; run: () => void; danger?: boolean }[];

  if (items.length === 0) return null;

  return (
    <div ref={rootRef} className="relative self-center">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Message options"
        aria-expanded={open}
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[#8A98A3] hover:text-[#20262D] hover:bg-[#F3F4F6] transition-opacity cursor-pointer ${
          open
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
        }`}
      >
        <FiChevronDown size={16} />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute top-full mt-1 z-30 w-40 bg-white rounded-xl shadow-lg border border-[#F1F4F7] overflow-hidden ${
            msg.fromMe ? "right-0" : "left-0"
          }`}
        >
          {items.map(({ label, icon: Icon, run, danger }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                run();
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                danger ? "text-red-500 hover:bg-red-50" : "text-[#20262D] hover:bg-[#F8FAFB]"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
