import { notFound } from "next/navigation";

import SpoilChatsList from "@spt/screens/main/messages/SpoilChatsList";
import { CHAT_ENABLED } from "@spt/utils/chat/enabled";

export default function MessagesPage() {
  if (!CHAT_ENABLED) notFound();
  return <SpoilChatsList />;
}
