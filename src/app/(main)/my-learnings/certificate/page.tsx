import MyLearningCertificatePage from "@spt/screens/main/spoils/myLearning/certificate";
import CertificateTokenBootstrap from "@spt/screens/main/spoils/myLearning/CertificateTokenBootstrap";

interface CertificateRoutePageProps {
  searchParams: Promise<{
    userId?: string;
    spoilId?: string;
    token?: string;
  }>;
}

// Single certificate route, driven by query params so the URL is self-documenting
// for the mobile app:
//   /my-learnings/certificate?userId={userId}&spoilId={spoilId}&token={token}
//
// With a token → replay the mobile session (store token, load the learner),
// then redirect to the same page WITHOUT the token. Without a token → just show
// the certificate (in-app viewing, learner already logged in).
export default async function CertificateRoutePage({
  searchParams,
}: CertificateRoutePageProps) {
  const { userId, spoilId, token } = await searchParams;

  if (token) {
    return (
      <CertificateTokenBootstrap
        userId={userId ?? ""}
        spoilId={spoilId ?? ""}
        token={token}
      />
    );
  }

  return <MyLearningCertificatePage spoilId={spoilId ?? ""} />;
}
