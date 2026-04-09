"use client";

import { useEffect } from "react";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import ArrowLeftIcon from "@spt/assets/icons/arrow-left.svg";
import Button from "@spt/components/button";
import useGetSpoilTemplateQuery from "@spt/hooks/apiRequests/useGetSpoilTemplateQuery";
import useCreateSpoilStore from "@spt/store/createSpoilStore";

import CertificateTemplatePreview from "./components/CertificateTemplatePreview";

const getTemplateName = (
  templateName?: string | null,
  fallback = "Certificate Template",
) => {
  if (!templateName?.trim()) {
    return fallback;
  }

  return templateName
    .replace(/\.html$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export default function CertificateTemplatePreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow") === "simple" ? "simple" : "advanced";

  const { data: spoilTemplate, isLoading, isError, errorMessage } =
    useGetSpoilTemplateQuery();

  const certificateTemplate = useCreateSpoilStore(
    (state) => state.certificateTemplate,
  );
  const certificateCustomization = useCreateSpoilStore(
    (state) => state.certificateCustomization,
  );
  const setCertificateTemplate = useCreateSpoilStore(
    (state) => state.setCertificateTemplate,
  );

  useEffect(() => {
    if (!spoilTemplate) {
      return;
    }

    setCertificateTemplate({
      id: spoilTemplate.id,
      code: spoilTemplate.code,
      name: getTemplateName(
        spoilTemplate.template?.certificate_template_name,
        certificateTemplate?.name || "Certificate Template",
      ),
      templateContent: spoilTemplate.template?.template_content || "",
      templateFileName:
        spoilTemplate.template?.certificate_template_name || null,
    });
  }, [certificateTemplate?.name, setCertificateTemplate, spoilTemplate]);

  const resolvedMarkup =
    spoilTemplate?.template?.template_content ||
    certificateTemplate?.templateContent ||
    "";
  const resolvedName = getTemplateName(
    spoilTemplate?.template?.certificate_template_name,
    certificateTemplate?.name || "Certificate Template",
  );

  const handleBack = () => {
    router.push(`/create-spoils/certificate-template/customize?flow=${flow}`);
  };

  const handleContinue = () => {
    router.push(
      flow === "simple"
        ? "/create-spoils/simple-spoil"
        : "/create-spoils/advance-spoil",
    );
  };

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

        <div className="mt-6 flex flex-col gap-3">
          <h1 className="text-lg font-semibold tracking-[-0.03em] text-[#212529] sm:text-xl">
            Certificate Preview
          </h1>
          <p className="text-sm text-[#667085]">
            Review the saved certificate template linked to this spoil.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-8 h-[420px] animate-pulse rounded-3xl border border-[#EEF2F6] bg-white" />
        ) : null}

        {isError ? (
          <div className="mt-8 rounded-2xl border border-[#F3D2D2] bg-[#FFF7F7] px-5 py-4 text-sm text-[#9B1C1C]">
            {errorMessage}
          </div>
        ) : null}

        {!isLoading && !isError && resolvedMarkup ? (
          <div className="mt-8 rounded-[28px] border border-[#E6EEF2] bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
            <CertificateTemplatePreview
              markup={resolvedMarkup}
              title={`${resolvedName} preview`}
              logoImage={certificateCustomization.logoImage}
              signatureImage={certificateCustomization.signatureImage}
              logoPlacement={certificateCustomization.logoPlacement}
              signaturePlacement={certificateCustomization.signaturePlacement}
              outerClassName="relative w-full overflow-hidden bg-white"
              useResponsiveScaling
            />
          </div>
        ) : null}

        {!isLoading && !isError && !resolvedMarkup ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#D5DDE5] bg-white px-6 py-12 text-center text-[#667085]">
            No saved certificate template was found for this spoil yet.
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <Button
            variant="outline"
            className="rounded-xl px-8 text-[#0B5368]"
            onClick={handleBack}
          >
            Edit Certificate
          </Button>
          <Button
            variant="darkBlue"
            className="rounded-xl px-8"
            onClick={handleContinue}
          >
            Back To Review
          </Button>
        </div>
      </div>
    </section>
  );
}
