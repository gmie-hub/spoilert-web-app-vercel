"use client";
import React, { useEffect, useRef, useState } from "react";

import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";
import { FiMic, FiPaperclip, FiSend, FiSmile } from "react-icons/fi";

import { AttachmentMenu } from "./AttachmentMenu";
import { RecordingBar } from "./RecordingBar";
import { getTime } from "./types";

import type { ChatMessage } from "./types";

interface Props {
  inputText: string;
  onInputChange: (text: string) => void;
  onSendText: () => void;
  isRecording: boolean;
  recordingDuration: number;
  recordingCancelled: boolean;
  slideOffset: number;
  onCancelRecording: () => void;
  onMicStart: (clientX: number) => void;
  onAddMessage: (msg: ChatMessage) => void;
  onScrollToEnd: () => void;
}

export function ChatInputBar({
  inputText,
  onInputChange,
  onSendText,
  isRecording,
  recordingDuration,
  recordingCancelled,
  slideOffset,
  onCancelRecording,
  onMicStart,
  onAddMessage,
  onScrollToEnd,
}: Props) {
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showAttachMenu) return;
    const close = () => setShowAttachMenu(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showAttachMenu]);

  useEffect(() => {
    if (!showEmojiPicker) return;
    const close = (e: MouseEvent) => {
      if (
        emojiPickerRef.current?.contains(e.target as Node) ||
        emojiButtonRef.current?.contains(e.target as Node)
      ) return;
      setShowEmojiPicker(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const input = inputRef.current;
    if (!input) {
      onInputChange(inputText + emojiData.emoji);
      return;
    }
    const start = input.selectionStart ?? inputText.length;
    const end = input.selectionEnd ?? inputText.length;
    const next = inputText.slice(0, start) + emojiData.emoji + inputText.slice(end);
    onInputChange(next);
    // restore cursor after the inserted emoji
    requestAnimationFrame(() => {
      const pos = start + emojiData.emoji.length;
      input.setSelectionRange(pos, pos);
      input.focus();
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "document",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "image") {
      onAddMessage({ id: Date.now(), type: "image", imageUrl: url, fileName: file.name, fromMe: true, time: getTime() });
    } else {
      const kb = file.size / 1024;
      const fileSize = kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
      onAddMessage({ id: Date.now(), type: "document", fileUrl: url, fileName: file.name, fileSize, fromMe: true, time: getTime() });
    }
    e.target.value = "";
    setShowAttachMenu(false);
    onScrollToEnd();
  };

  return (
    <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-t border-[#E9EEF2] shrink-0 relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx,.zip"
        className="hidden"
        onChange={(e) => handleFileChange(e, "document")}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, "image")}
      />

      {showAttachMenu && (
        <AttachmentMenu
          onImageClick={() => imageInputRef.current?.click()}
          onDocumentClick={() => fileInputRef.current?.click()}
        />
      )}

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full mb-2 left-0 z-30"
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={Theme.LIGHT}
            lazyLoadEmojis
            height={380}
            width={300}
          />
        </div>
      )}

      {isRecording ? (
        <RecordingBar
          duration={recordingDuration}
          cancelled={recordingCancelled}
          slideOffset={slideOffset}
          onCancel={onCancelRecording}
        />
      ) : (
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#F5F6F8] rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5">
          <button
            ref={emojiButtonRef}
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className={`inline-flex shrink-0 transition-colors ${showEmojiPicker ? "text-[#0B5368]" : "text-[#8A98A3] hover:text-[#20262D]"}`}
          >
            <FiSmile size={20} />
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder="Send a message..."
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSendText();
            }}
            className="flex-1 min-w-0 text-sm outline-none bg-transparent placeholder:text-[#8A98A3] text-[#20262D]"
          />

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAttachMenu((prev) => !prev);
              }}
              className={`transition-colors ${showAttachMenu ? "text-[#0B5368]" : "text-[#8A98A3] hover:text-[#20262D]"}`}
            >
              <FiPaperclip size={18} />
            </button>

            {inputText.trim() ? (
              <button
                type="button"
                onClick={onSendText}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0B5368] flex items-center justify-center text-white hover:bg-[#0a4a5a] transition-colors shrink-0"
              >
                <FiSend size={13} />
              </button>
            ) : (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onMicStart(e.clientX);
                }}
                onTouchStart={(e) => onMicStart(e.touches[0].clientX)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0B5368] flex items-center justify-center text-white hover:bg-[#0a4a5a] transition-colors select-none shrink-0"
              >
                <FiMic size={13} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
