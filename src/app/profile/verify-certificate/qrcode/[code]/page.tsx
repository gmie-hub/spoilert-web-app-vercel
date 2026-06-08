import { notFound } from "next/navigation";

import VerifyCertificatePage from "@spt/screens/main/profile/verify-certificate";




interface VerifyCertificateQrCodePageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function VerifyCertificateQrCodePage({
  params,
}: VerifyCertificateQrCodePageProps) {
  const { code } = await params;

  if (!code) {
    notFound();
  }

  return <VerifyCertificatePage initialCertificateId={decodeURIComponent(code)} />;
}
