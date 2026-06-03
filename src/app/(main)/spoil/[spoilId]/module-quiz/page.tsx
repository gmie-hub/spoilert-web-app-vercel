import PreSpoilQuizPage from "@spt/screens/main/spoil/preSpoilQuiz";

interface ModuleQuizRoutePageProps {
  params: Promise<{
    spoilId: string;
  }>;
  searchParams: Promise<{
    moduleId?: string;
  }>;
}

export default async function ModuleQuizRoutePage({
  params,
  searchParams,
}: ModuleQuizRoutePageProps) {
  const { spoilId } = await params;
  const { moduleId } = await searchParams;

  return (
    <PreSpoilQuizPage
      spoilId={spoilId}
      quizType="module"
      moduleId={moduleId ?? null}
    />
  );
}
