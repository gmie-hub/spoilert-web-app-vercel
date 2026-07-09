import CertificateTokenBootstrap from "@spt/screens/main/spoils/myLearning/CertificateTokenBootstrap";

interface CertificateTokenRoutePageProps {
  params: Promise<{
    spoilId: string;
    token: string;
  }>;
}

// Deep link the mobile app navigates to:
// /my-learnings/certificate/{spoilId}/{token}
// It stores the token, loads the learner, then redirects to the certificate
// page at /my-learnings/certificate/{spoilId}.
export default async function CertificateTokenRoutePage({
  params,
}: CertificateTokenRoutePageProps) {
  const { spoilId, token } = await params;

  return <CertificateTokenBootstrap spoilId={spoilId} token={token} />;
}
