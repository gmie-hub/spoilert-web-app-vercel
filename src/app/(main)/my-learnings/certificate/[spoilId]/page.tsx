import MyLearningCertificatePage from "@spt/screens/main/spoils/myLearning/certificate";

interface MyLearningCertificateRoutePageProps {
  params: Promise<{
    spoilId: string;
  }>;
}

export default async function MyLearningCertificateRoutePage({
  params,
}: MyLearningCertificateRoutePageProps) {
  const { spoilId } = await params;

  return <MyLearningCertificatePage spoilId={spoilId} />;
}

