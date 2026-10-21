/** A person in the "My Chats" list. */
export interface Contact {
  /** The other person's user id. */
  id: string;
  name: string;
  avatar?: string | null;
  lastMessage: string;
  time: string;
  /** Messages from them I haven't opened. */
  unread: number;
  online: boolean;
  /** The last message was mine. */
  fromMe: boolean;
  /** …and they've opened it. */
  seen: boolean;
}

export type ChatTab = "all" | "unread";
