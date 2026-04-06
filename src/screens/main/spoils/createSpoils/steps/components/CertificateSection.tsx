"use client";

import { FC } from "react";

import { useRouter } from "next/navigation";

import Button from "@spt/components/button";
import useCreateSpoilStore from "@spt/store/createSpoilStore";

import CertificateTemplatePreview from "../../components/CertificateTemplatePreview";

import type { SpoilTypeOption } from "../../types";

interface CertificateSectionProps {
  selectedType: SpoilTypeOption;
}

const CertificateSection: FC<CertificateSectionProps> = ({ selectedType }) => {
  const router = useRouter();
  const certificateTemplate = useCreateSpoilStore(
    (state) => state.certificateTemplate,
  );
  const certificateCustomization = useCreateSpoilStore(
    (state) => state.certificateCustomization,
  );

  const handleCustomize = () => {
    router.push(`/create-spoils/certificate-template?flow=${selectedType}`);
  };

  return (
    <div className="rounded-2xl border border-[#E6EEF2] bg-[#F7FBFD] p-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-24 overflow-hidden rounded-xl border border-[#D8E4EA] bg-white">
            {certificateTemplate?.templateContent ? (
              <CertificateTemplatePreview
                markup={certificateTemplate.templateContent}
                title={
                  certificateTemplate.name || "Certificate template preview"
                }
                logoImage={certificateCustomization.logoImage}
                signatureImage={certificateCustomization.signatureImage}
                outerClassName="relative h-full w-full overflow-hidden bg-white"
                canvasClassName="absolute left-1/2 top-0 h-[842px] w-[420px] origin-top overflow-hidden bg-white"
                transform="translateX(-50%) scale(0.15)"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#F2F7FA] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7A8A96]">
                No Preview
              </div>
            )}
          </div>

          <div className="max-w-md">
            <p className="leading-relaxed text-[#425466]">
              Give your learners a beautifully designed certificate when they
              complete this spoil.
            </p>

            <p className="mt-2 text-sm font-medium text-[#0B5368]">
              {certificateTemplate?.name
                ? `Selected template: ${certificateTemplate.name}`
                : "No certificate template selected yet."}
            </p>

            {certificateTemplate?.code ? (
              <p className="mt-1 text-xs text-[#6B7C88]">
                Template code: {certificateTemplate.code}
              </p>
            ) : null}
          </div>
        </div>

        <Button
          className="rounded-lg bg-[#003344] px-6 text-white hover:bg-[#002233]"
          onClick={handleCustomize}
        >
          {certificateTemplate ? "Change Certificate" : "Customize Certificate"}
        </Button>
      </div>
    </div>
  );
};

export default CertificateSection;
