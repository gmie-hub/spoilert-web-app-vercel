import { notFound } from "next/navigation";

import ChatView from "@spt/screens/main/profile/mySpoil/components/ChatView";
import { CHAT_ENABLED } from "@spt/utils/chat/enabled";

interface Props {
  params: Promise<{ spoilId: string; enrollmentId: string }>;
}

export default async function ChatPage({ params }: Props) {
  if (!CHAT_ENABLED) notFound();
  const { spoilId, enrollmentId } = await params;
  return <ChatView spoilId={Number(spoilId)} enrollmentId={Number(enrollmentId)} />;
}
