import LearnerProgressScreen from "@spt/screens/main/profile/mySpoil/components/LearnerProgressScreen";

interface Props {
  params: Promise<{ spoilId: string; enrollmentId: string }>;
}

export default async function LearnerProgressPage({ params }: Props) {
  const { spoilId, enrollmentId } = await params;
  return <LearnerProgressScreen spoilId={Number(spoilId)} enrollmentId={Number(enrollmentId)} />;
}
