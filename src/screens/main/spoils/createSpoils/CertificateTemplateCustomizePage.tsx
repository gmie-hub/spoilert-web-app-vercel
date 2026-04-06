"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import ArrowLeftIcon from "@spt/assets/icons/arrow-left.svg";
import useCreateSpoilStore from "@spt/store/createSpoilStore";

import CertificateCustomizationWorkspace from "./components/CertificateCustomizationWorkspace";

export default function CertificateTemplateCustomizePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow") === "simple" ? "simple" : "advanced";

  const certificateTemplate = useCreateSpoilStore(
    (state) => state.certificateTemplate,
  );
  const certificateCustomization = useCreateSpoilStore(
    (state) => state.certificateCustomization,
  );
  const setCertificateCustomization = useCreateSpoilStore(
    (state) => state.setCertificateCustomization,
  );
  const setCertificateElementOverride = useCreateSpoilStore(
    (state) => state.setCertificateElementOverride,
  );

  const handleBack = () => {
    router.push(`/create-spoils/certificate-template?flow=${flow}`);
  };

  const handleSave = () => {
    router.push(
      flow === "simple"
        ? "/create-spoils/simple-spoil"
        : "/create-spoils/advance-spoil",
    );
  };

  if (!certificateTemplate) {
    router.push(`/create-spoils/certificate-template?flow=${flow}`);
    return null;
  }

  return (
    <section className="min-h-screen px-4 py-8 sm:px-6 lg:px-20">
      <div className="mx-auto">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0C4A5C]"
        >
          <Image src={ArrowLeftIcon} alt="Back" width={18} height={18} />
          Back
        </button>

        <h1 className="mt-6 text-lg font-semibold tracking-[-0.03em] text-[#212529] sm:text-xl">
          Customize
        </h1>

        <CertificateCustomizationWorkspace
          certificateTemplate={certificateTemplate}
          certificateCustomization={certificateCustomization}
          onUpdateCustomization={setCertificateCustomization}
          onUpdateTextElement={setCertificateElementOverride}
          onSave={handleSave}
        />
      </div>
    </section>
  );
}
