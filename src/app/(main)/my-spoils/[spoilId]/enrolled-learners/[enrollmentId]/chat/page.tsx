import ChatView from "@spt/screens/main/profile/mySpoil/components/ChatView";

interface Props {
  params: Promise<{ spoilId: string; enrollmentId: string }>;
}

export default async function ChatPage({ params }: Props) {
  const { spoilId, enrollmentId } = await params;
  return <ChatView spoilId={Number(spoilId)} enrollmentId={Number(enrollmentId)} />;
}
