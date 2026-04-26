import Image from "next/image";
import { FiFile } from "react-icons/fi";

import { AudioPlayer } from "./AudioPlayer";

import type { ChatMessage } from "./types";

interface Props {
  msg: ChatMessage;
  learnerInitial: string;
}

export function MessageBubble({ msg, learnerInitial }: Props) {
  const bubbleClass = msg.fromMe
    ? "bg-[#EBF5F9] rounded-2xl rounded-br-sm"
    : "bg-[#F3F4F6] rounded-2xl rounded-bl-sm";

  return (
    <div
      className={`flex items-end gap-2 ${msg.fromMe ? "justify-end" : "justify-start"}`}
    >
      {!msg.fromMe && (
        <div className="w-8 h-8 rounded-full bg-[#E8EEF2] shrink-0 flex items-center justify-center text-xs font-semibold text-[#0B5368]">
          {learnerInitial}
        </div>
      )}

      <div
        className={`max-w-[65%] flex flex-col ${msg.fromMe ? "items-end" : "items-start"}`}
      >
        <div
          className={`w-fit text-sm text-[#20262D] leading-relaxed ${
            msg.type === "image" ? "overflow-hidden rounded-2xl" : `px-4 py-3 ${bubbleClass}`
          }`}
        >
          {msg.type === "text" && msg.text}

          {msg.type === "audio" && msg.audioUrl && (
            <AudioPlayer url={msg.audioUrl} duration={msg.audioDuration} fromMe={msg.fromMe} />
          )}

          {msg.type === "image" && msg.imageUrl && (
            <div className="relative w-52 h-40 rounded-2xl overflow-hidden">
              <Image src={msg.imageUrl} alt={msg.fileName ?? "image"} fill className="object-cover" />
            </div>
          )}

          {msg.type === "document" && (
            <a
              href={msg.fileUrl}
              download={msg.fileName}
              className="flex items-center gap-3 min-w-[180px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-10 rounded-xl bg-[#0B5368]/10 flex items-center justify-center shrink-0">
                <FiFile size={20} className="text-[#0B5368]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#20262D] truncate">{msg.fileName}</p>
                <p className="text-xs text-[#8A98A3]">{msg.fileSize}</p>
              </div>
            </a>
          )}
        </div>

        <div className="flex items-center gap-1 mt-1.5 px-1">
          <span className="text-[10px] text-[#8A98A3]">{msg.time}</span>
          {msg.fromMe && (
            <span className="text-[10px] text-[#0B5368] font-semibold tracking-tighter">✓✓</span>
          )}
        </div>
      </div>

      {msg.fromMe && (
        <div className="w-8 h-8 rounded-full bg-[#E8EEF2] shrink-0 flex items-center justify-center text-[10px] font-semibold text-[#0B5368]">
          Me
        </div>
      )}
    </div>
  );
}
