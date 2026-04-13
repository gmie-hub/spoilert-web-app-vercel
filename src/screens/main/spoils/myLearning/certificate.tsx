"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import ArrowLeftIcon from "@spt/assets/icons/arrow-left.svg";
import CertificateImage from "@spt/assets/icons/heroimage1.svg";
import Button from "@spt/components/button";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";

interface MyLearningCertificatePageProps {
  spoilId: number | string;
}

const getFileName = (title?: string) => {
  if (!title) {
    return "spoilert-certificate.png";
  }

  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-certificate.png`;
};

export default function MyLearningCertificatePage({
  spoilId,
}: MyLearningCertificatePageProps) {
  const router = useRouter();
  const { data: spoil } = useGetSpoilDetailsQuery(spoilId);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/my-learnings?tab=completed");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = CertificateImage.src;
    link.download = getFileName(spoil?.title);
    link.click();
  };

  return (
    <section className="min-h-screen bg-[#FAFAFA] px-4 py-8 sm:px-6 lg:px-20">
      <div className="mx-auto max-w-[1120px]">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0C4A5C]"
        >
          <Image src={ArrowLeftIcon} alt="Back" width={18} height={18} />
          Back
        </button>

        <h1 className="mt-10 text-[40px] font-semibold tracking-[-0.03em] text-[#212529]">
          My Learnings
        </h1>

        <div className="mx-auto mt-10 max-w-[760px] rounded-[20px] border border-[#ECEFF2] bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="overflow-hidden rounded-[14px] border border-[#F0F2F4] bg-[#FCFCFC]">
            <Image
              src={CertificateImage}
              alt={spoil?.title ? `${spoil.title} certificate` : "Certificate preview"}
              className="h-auto w-full"
              priority
            />
          </div>

          <Button
            variant="darkBlue"
            className="mt-8 w-full rounded-[12px] py-4"
            onClick={handleDownload}
          >
            Download Certificate
          </Button>

          <Button
            variant="outline"
            className="mt-4 w-full rounded-[12px] border-[#D7DCE0] py-4 text-[#0B5368] hover:bg-white"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </section>
  );
}

