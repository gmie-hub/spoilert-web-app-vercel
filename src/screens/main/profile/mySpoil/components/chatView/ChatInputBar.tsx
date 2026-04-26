"use client";

import { useEffect, useRef, useState } from "react";

import { FiMic, FiPaperclip, FiSend, FiSmile } from "react-icons/fi";

import { AttachmentMenu } from "./AttachmentMenu";
import { RecordingBar } from "./RecordingBar";
import type { ChatMessage } from "./types";
import { getTime } from "./types";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showAttachMenu) return;
    const close = () => setShowAttachMenu(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showAttachMenu]);

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
    <div className="px-4 py-3 border-t border-[#E9EEF2] shrink-0 relative">
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

      {isRecording ? (
        <RecordingBar
          duration={recordingDuration}
          cancelled={recordingCancelled}
          slideOffset={slideOffset}
          onCancel={onCancelRecording}
        />
      ) : (
        <div className="flex items-center gap-2 rounded-xl px-3 py-2">
          <button
            type="button"
            className="text-[#8A98A3] hover:text-[#20262D] shrink-0 transition-colors"
          >
            <FiSmile size={20} />
          </button>

          <input
            type="text"
            placeholder="Send a message..."
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSendText();
            }}
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-[#8A98A3] text-[#20262D]"
          />

          <div className="flex items-center gap-3 shrink-0">
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
                className="w-9 h-9 rounded-full bg-[#0B5368] flex items-center justify-center text-white hover:bg-[#0a4a5a] transition-colors"
              >
                <FiSend size={14} />
              </button>
            ) : (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onMicStart(e.clientX);
                }}
                onTouchStart={(e) => onMicStart(e.touches[0].clientX)}
                className="w-9 h-9 rounded-full bg-[#0B5368] flex items-center justify-center text-white hover:bg-[#0a4a5a] transition-colors select-none"
              >
                <FiMic size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
