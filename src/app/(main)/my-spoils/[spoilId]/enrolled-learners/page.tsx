import EnrolledLearnersScreen from "@spt/screens/main/profile/mySpoil/components/EnrolledLearnersScreen";

interface Props {
  params: Promise<{ spoilId: string }>;
}

export default async function EnrolledLearnersPage({ params }: Props) {
  const { spoilId } = await params;
  return <EnrolledLearnersScreen spoilId={Number(spoilId)} />;
}
