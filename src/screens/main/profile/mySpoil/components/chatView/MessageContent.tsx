import Image from "next/image";
import { FiFile, FiLoader } from "react-icons/fi";

import { formatFileSize } from "@spt/utils/chat/format";

import { AudioPlayer } from "./AudioPlayer";

import type { ChatMessage } from "./types";

const PLACEHOLDER_LABEL: Record<ChatMessage["type"], string> = {
  text: "",
  image: "Photo",
  video: "Video",
  audio: "Voice note",
  document: "Document",
};

/** A media message whose file is still uploading on the sender's side. */
function MediaPlaceholder({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex items-center gap-2 text-[#8A98A3] text-sm">
      <FiLoader size={16} className="animate-spin shrink-0" />
      {PLACEHOLDER_LABEL[msg.type]} on its way…
    </div>
  );
}

function UploadBar({ progress }: { progress?: number }) {
  if (progress == null) return null;
  return (
    <div className="h-1 w-full rounded-full bg-white/60 overflow-hidden">
      <div
        className="h-full bg-[#0B5368] transition-[width] duration-200"
        style={{ width: `${Math.round(progress * 100)}%` }}
      />
    </div>
  );
}

/** The body of a bubble for each message type. */
export function MessageContent({ msg }: { msg: ChatMessage }) {
  const uploading = msg.status === "sending" && msg.uploadProgress != null;

  if (msg.isDeleted) {
    return <span className="italic text-[#8A98A3]">This message was deleted</span>;
  }

  if (msg.type === "text") {
    // "anywhere" lets a long link or word wrap instead of widening the screen.
    return <span className="whitespace-pre-wrap [overflow-wrap:anywhere]">{msg.text}</span>;
  }

  if (!msg.mediaUrl) return <MediaPlaceholder msg={msg} />;

  if (msg.type === "image") {
    return (
      <a
        href={uploading ? undefined : msg.mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-52 h-40 rounded-2xl overflow-hidden bg-[#F3F4F6]"
      >
        <Image
          src={msg.mediaUrl}
          alt={msg.fileName ?? "Photo"}
          fill
          unoptimized
          className={`object-cover ${uploading ? "opacity-70" : ""}`}
        />
        {uploading && (
          <span className="absolute inset-x-3 bottom-3">
            <UploadBar progress={msg.uploadProgress} />
          </span>
        )}
      </a>
    );
  }

  if (msg.type === "video") {
    return (
      <div className="relative w-60 rounded-2xl overflow-hidden bg-black">
        <video
          src={msg.mediaUrl}
          poster={msg.thumbnailUrl}
          controls={!uploading}
          preload="metadata"
          className={`w-full max-h-64 ${uploading ? "opacity-70" : ""}`}
        />
        {uploading && (
          <span className="absolute inset-x-3 bottom-3">
            <UploadBar progress={msg.uploadProgress} />
          </span>
        )}
      </div>
    );
  }

  if (msg.type === "audio") {
    return (
      <div className="flex flex-col gap-2">
        <AudioPlayer url={msg.mediaUrl} duration={msg.duration} fromMe={msg.fromMe} />
        {uploading && <UploadBar progress={msg.uploadProgress} />}
      </div>
    );
  }

  return (
    <a
      href={uploading ? undefined : msg.mediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      download={msg.fileName}
      className="flex flex-col gap-2 min-w-[180px] max-w-[260px]"
    >
      <span className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-[#0B5368]/10 flex items-center justify-center shrink-0">
          <FiFile size={20} className="text-[#0B5368]" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium text-[#20262D] truncate">
            {msg.fileName ?? "Document"}
          </span>
          <span className="block text-xs text-[#8A98A3]">{formatFileSize(msg.fileSize)}</span>
        </span>
      </span>
      {uploading && <UploadBar progress={msg.uploadProgress} />}
    </a>
  );
}
