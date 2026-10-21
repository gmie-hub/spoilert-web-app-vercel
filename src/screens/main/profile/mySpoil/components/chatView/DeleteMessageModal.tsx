"use client";

import { useEffect } from "react";

import { FiTrash2 } from "react-icons/fi";

import { DELETE_FOR_EVERYONE_WINDOW_MS } from "@spt/utils/chat/rules";

import type { ChatMessage } from "./types";

interface Props {
  msg: ChatMessage;
  onClose: () => void;
  onDeleteForMe: () => void;
  onDeleteForEveryone: () => void;
}

/** Delete for me, or — for my own recent messages — for everyone (mobile's rules). */
export function DeleteMessageModal({ msg, onClose, onDeleteForMe, onDeleteForEveryone }: Props) {
  const withinWindow = Date.now() - msg.sentAt.getTime() < DELETE_FOR_EVERYONE_WINDOW_MS;
  const canDeleteForEveryone = msg.fromMe && !msg.isDeleted && withinWindow;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Delete message"
        className="bg-white rounded-2xl w-full max-w-[400px] overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center px-8 pt-8 pb-5">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <FiTrash2 size={24} className="text-red-500" />
          </div>
          <h2 className="text-[17px] font-bold text-[#20262D]">Delete Message?</h2>
          <p className="text-sm text-[#8A98A3] mt-1.5">
            {canDeleteForEveryone
              ? "Delete it just for you, or for both of you."
              : "This message will only be deleted for you."}
          </p>
          {msg.fromMe && !msg.isDeleted && !withinWindow && (
            <p className="text-xs text-[#B45309] bg-[#FFF8E1] rounded-lg px-3 py-2 mt-3">
              Messages can only be deleted for everyone within 1 hour of sending.
            </p>
          )}
        </div>

        <div className="px-8 pb-8 flex flex-col gap-3">
          {canDeleteForEveryone && (
            <button
              type="button"
              onClick={onDeleteForEveryone}
              className="w-full py-3.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors cursor-pointer"
            >
              Delete for Everyone
            </button>
          )}
          <button
            type="button"
            onClick={onDeleteForMe}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
              canDeleteForEveryone
                ? "border border-red-200 text-red-500 hover:bg-red-50"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            Delete for Me
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-xl border border-[#E9EEF2] text-[#20262D] font-medium text-sm hover:bg-[#F8FAFB] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
