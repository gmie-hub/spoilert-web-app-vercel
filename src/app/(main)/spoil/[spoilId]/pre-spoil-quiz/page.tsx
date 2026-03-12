import PreSpoilQuizPage from "@spt/screens/main/spoil/preSpoilQuiz";

interface PreSpoilQuizRoutePageProps {
  params: Promise<{
    spoilId: string;
  }>;
}

export default async function PreSpoilQuizRoutePage({
  params,
}: PreSpoilQuizRoutePageProps) {
  const { spoilId } = await params;

  return <PreSpoilQuizPage spoilId={spoilId} />;
}
