import type { ChatMessage } from "@spt/screens/main/profile/mySpoil/components/chatView/types";

export interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  fromMe: boolean;
  avatarBg: string;
}

export type ChatTab = "all" | "unread";

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const DUMMY_CONTACTS: Contact[] = [
  {
    id: 1,
    name: "Jade Olasunmbo",
    lastMessage: "Good morning sir. It is direct and explanato...",
    time: "9:41am",
    unread: 1,
    online: true,
    fromMe: false,
    avatarBg: "#A8BAC6",
  },
  {
    id: 2,
    name: "Jane Coker",
    lastMessage: "I took my pre-spoil quiz and I have to...",
    time: "9:41am",
    unread: 1,
    online: false,
    fromMe: false,
    avatarBg: "#7A9BB2",
  },
  {
    id: 3,
    name: "Bunmi Davies",
    lastMessage: "That's good to hear",
    time: "9:41am",
    unread: 0,
    online: false,
    fromMe: true,
    avatarBg: "#95A5AE",
  },
  {
    id: 4,
    name: "Ogunsola Omorinsola",
    lastMessage: "Okay. Have a great day!",
    time: "9:41am",
    unread: 0,
    online: false,
    fromMe: true,
    avatarBg: "#7B8F9A",
  },
  {
    id: 5,
    name: "James Fortune",
    lastMessage: "My email address is ogunsol...",
    time: "9:41am",
    unread: 1,
    online: true,
    fromMe: false,
    avatarBg: "#C9864A",
  },
  {
    id: 6,
    name: "Mory Coco",
    lastMessage: "That's good to hear",
    time: "9:41am",
    unread: 0,
    online: false,
    fromMe: true,
    avatarBg: "#A0B5C0",
  },
  {
    id: 7,
    name: "Shekinah Glory",
    lastMessage: "I still haven't a reply and this...",
    time: "9:41am",
    unread: 1,
    online: true,
    fromMe: false,
    avatarBg: "#8499A5",
  },
  {
    id: 8,
    name: "Jade Simone",
    lastMessage: "Hey, I need help with...",
    time: "9:41am",
    unread: 0,
    online: false,
    fromMe: false,
    avatarBg: "#9CADB8",
  },
];

export const INITIAL_MESSAGES: Record<number, ChatMessage[]> = {
  4: [
    {
      id: 1,
      type: "text",
      text: "Hi, how are you doing? Just doing a check with my students. How has the Spoil been so far?",
      fromMe: true,
      time: "10:30 AM",
    },
    {
      id: 2,
      type: "text",
      text: "Good morning sir. It is direct and well explanatory. Kudos to you sir.",
      fromMe: false,
      time: "10:15 AM",
    },
    {
      id: 3,
      type: "text",
      text: "That's great to hear. You can always ask questions if you face any difficulty. I'm here to help.",
      fromMe: true,
      time: "10:30 AM",
    },
    {
      id: 4,
      type: "text",
      text: "Alright sir. But I currently dont have any questions for now. If I have, I'll definitely reach out.Thank you very much sir",
      fromMe: false,
      time: "10:15 AM",
    },
    {
      id: 5,
      type: "text",
      text: "Okay. Have a great day",
      fromMe: true,
      time: "10:30 AM",
    },
  ],
};
