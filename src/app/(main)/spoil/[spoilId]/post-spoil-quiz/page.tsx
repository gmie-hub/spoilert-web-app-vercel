import PreSpoilQuizPage from "@spt/screens/main/spoil/preSpoilQuiz";

interface PostSpoilQuizRoutePageProps {
  params: Promise<{
    spoilId: string;
  }>;
}

export default async function PostSpoilQuizRoutePage({
  params,
}: PostSpoilQuizRoutePageProps) {
  const { spoilId } = await params;

  return <PreSpoilQuizPage spoilId={spoilId} quizType="post" />;
}
