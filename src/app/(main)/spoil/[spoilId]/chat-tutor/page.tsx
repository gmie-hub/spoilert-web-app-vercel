import ChatWithTutor from "@spt/screens/main/spoil/ChatWithTutor";

interface Props {
  params: Promise<{ spoilId: string }>;
}

export default async function ChatWithTutorPage({ params }: Props) {
  const { spoilId } = await params;
  return <ChatWithTutor spoilId={Number(spoilId)} />;
}
