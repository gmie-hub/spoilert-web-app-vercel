import SpoilDetails from "@spt/screens/main/home/spoilDetails/spoilDetails";

interface SpoilDetailsByIdPageProps {
  params: Promise<{
    spoilId: string;
  }>;
}

export default async function SpoilDetailsByIdPage({
  params,
}: SpoilDetailsByIdPageProps) {
  const { spoilId } = await params;

  return <SpoilDetails spoilId={spoilId} />;
}
