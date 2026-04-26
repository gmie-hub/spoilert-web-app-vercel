export type MessageType = "text" | "audio" | "image" | "document";

export interface ChatMessage {
  id: number;
  type: MessageType;
  text?: string;
  audioUrl?: string;
  audioDuration?: number;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  imageUrl?: string;
  fromMe: boolean;
  time: string;
}

export const WAVEFORM = [4, 8, 14, 6, 16, 10, 4, 12, 8, 6, 14, 16, 5, 10, 8, 13, 6, 12, 4, 10];

export const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export const getTime = () =>
  new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
