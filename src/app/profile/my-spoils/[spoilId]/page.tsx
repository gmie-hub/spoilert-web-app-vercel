import { notFound } from "next/navigation";

import MySpoilDetailScreen from "@spt/screens/main/profile/mySpoil/components/MySpoilDetailScreen";

interface MySpoilDetailPageProps {
  params: Promise<{
    spoilId: string;
  }>;
}

// A tutor's Spoylz details, e.g. /profile/my-spoils/164. /profile/my-spoils
// itself is still the My Spoylz list (profile/[section]).
export default async function MySpoilDetailPage({ params }: MySpoilDetailPageProps) {
  const { spoilId } = await params;
  const id = Number(spoilId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  return <MySpoilDetailScreen spoilId={id} />;
}
