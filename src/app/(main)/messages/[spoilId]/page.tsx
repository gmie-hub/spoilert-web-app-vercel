import { notFound } from "next/navigation";

import SpoilChatDetail from "@spt/screens/main/messages/SpoilChatDetail";
import { CHAT_ENABLED } from "@spt/utils/chat/enabled";

interface Props {
  params: Promise<{ spoilId: string }>;
}

export default async function SpoilChatDetailPage({ params }: Props) {
  if (!CHAT_ENABLED) notFound();
  const { spoilId } = await params;
  return <SpoilChatDetail spoilId={spoilId} />;
}
