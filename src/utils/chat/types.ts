import type { Timestamp } from "firebase/firestore";

// Firestore document shapes shared with the mobile app
// (lib/features/chat/data/models in spoilert_mobile_app). Field names and
// values must stay identical, or messages sent from one platform will not
// render on the other.

export type ChatMessageKind = "text" | "image" | "video" | "audio" | "document";

export type ChatMessageStatus = "sending" | "sent" | "delivered" | "read";

/** conversations/{conversationId} */
export interface ConversationDoc {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantAvatars: Record<string, string | null>;
  lastMessage?: string | null;
  lastMessageType?: ChatMessageKind | null;
  lastMessageTime?: Timestamp | null;
  lastMessageSenderId?: string | null;
  unreadCount: Record<string, number>;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface ReplyDoc {
  messageId: string;
  text: string;
  senderId: string;
  senderName: string;
  type: ChatMessageKind;
}

/** conversations/{conversationId}/messages/{messageId} */
export interface MessageDoc {
  id: string;
  senderId: string;
  senderName: string;
  text?: string | null;
  type: ChatMessageKind;
  mediaUrl?: string | null;
  thumbnailUrl?: string | null;
  /** Seconds, for audio and video. */
  duration?: number | null;
  fileName?: string | null;
  /** Bytes. */
  fileSize?: number | null;
  timestamp?: Timestamp | null;
  status?: ChatMessageStatus;
  readBy?: string[];
  replyTo?: ReplyDoc | null;
  isEdited?: boolean;
  editedAt?: Timestamp | null;
  deletedFor?: string[];
  isDeleted?: boolean;
  /** True while this client's write has not reached the server yet. */
  hasPendingWrites?: boolean;
}

/** presence/{userId} */
export interface PresenceInfo {
  isOnline: boolean;
  lastSeen: Date | null;
}

/** One side of a conversation, as stored in participantNames/participantAvatars. */
export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string | null;
}

/** What a new message carries besides sender and time. */
export interface OutgoingMessage {
  type: ChatMessageKind;
  text?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  fileName?: string;
  fileSize?: number;
  /** The message this one answers. */
  replyTo?: ReplyDoc;
}
