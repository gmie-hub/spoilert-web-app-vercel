import type { ChatMessageKind } from "@spt/utils/chat/types";

export type MessageType = ChatMessageKind;

/** sending: not on the server yet; read: the other person has opened it. */
export type MessageDeliveryStatus = "sending" | "sent" | "read" | "failed";

export interface ChatMessage {
  id: string;
  type: MessageType;
  text?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  /** Seconds, for audio and video. */
  duration?: number;
  fileName?: string;
  /** Bytes. */
  fileSize?: number;
  fromMe: boolean;
  sentAt: Date;
  status: MessageDeliveryStatus;
  isEdited?: boolean;
  isDeleted?: boolean;
  replyTo?: { senderName: string; text: string } | null;
  /** 0–1 while one of my files is uploading. */
  uploadProgress?: number;
}

export const WAVEFORM = [4, 8, 14, 6, 16, 10, 4, 12, 8, 6, 14, 16, 5, 10, 8, 13, 6, 12, 4, 10];

export const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};
