import SpoilOverview from "@spt/screens/main/spoil";

interface SpoilOverviewPageProps {
  params: Promise<{
    spoilId: string;
  }>;
}

export default async function SpoilOverviewPage({
  params,
}: SpoilOverviewPageProps) {
  const { spoilId } = await params;

  return <SpoilOverview spoilId={spoilId} />;
}
