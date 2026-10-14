import SpoilDetails from "@spt/screens/main/home/spoilDetails/spoilDetails";

interface SpoilPageProps {
  params: Promise<{
    spoilId: string;
  }>;
}

/** Bare `/spoil/:id` URL (shared by the mobile app) — shows the spoil's details page. */
export default async function SpoilPage({ params }: SpoilPageProps) {
  const { spoilId } = await params;

  return <SpoilDetails spoilId={spoilId} />;
}
