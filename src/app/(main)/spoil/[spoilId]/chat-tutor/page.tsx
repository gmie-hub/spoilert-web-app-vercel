import { notFound } from "next/navigation";

import ChatWithTutor from "@spt/screens/main/spoil/ChatWithTutor";
import { CHAT_ENABLED } from "@spt/utils/chat/enabled";

interface Props {
  params: Promise<{ spoilId: string }>;
}

export default async function ChatWithTutorPage({ params }: Props) {
  if (!CHAT_ENABLED) notFound();
  const { spoilId } = await params;
  return <ChatWithTutor spoilId={Number(spoilId)} />;
}
