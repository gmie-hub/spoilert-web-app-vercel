import StartSpoilPage from "@spt/screens/main/spoil/startSpoil";

interface StartSpoilRoutePageProps {
  params: Promise<{
    spoilId: string;
  }>;
}

export default async function StartSpoilRoutePage({
  params,
}: StartSpoilRoutePageProps) {
  const { spoilId } = await params;

  return <StartSpoilPage spoilId={spoilId} />;
}
