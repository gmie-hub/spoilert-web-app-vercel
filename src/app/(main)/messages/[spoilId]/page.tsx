import SpoilChatDetail from "@spt/screens/main/messages/SpoilChatDetail";

interface Props {
  params: Promise<{ spoilId: string }>;
}

export default async function SpoilChatDetailPage({ params }: Props) {
  // const { spoilId } = await params;
  return <SpoilChatDetail  />;
}
