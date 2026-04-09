"use client";

import { FC, useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import editIcon from "@spt/assets/icons/white-edit.svg";
import Button from "@spt/components/button";
import useGetSpoilTemplateQuery from "@spt/hooks/apiRequests/useGetSpoilTemplateQuery";
import useCreateSpoilStore from "@spt/store/createSpoilStore";

import CertificateTemplatePreview from "../../components/CertificateTemplatePreview";

import type { SpoilTypeOption } from "../../types";


interface CertificateSectionProps {
  selectedType: SpoilTypeOption;
  spoilId?: number | string | null;
}

const CertificateSection: FC<CertificateSectionProps> = ({
  selectedType,
  spoilId = null,
}) => {
  const router = useRouter();
  const certificateTemplate = useCreateSpoilStore(
    (state) => state.certificateTemplate,
  );
  const setCertificateTemplate = useCreateSpoilStore(
    (state) => state.setCertificateTemplate,
  );
  const certificateCustomization = useCreateSpoilStore(
    (state) => state.certificateCustomization,
  );
  const { data: spoilTemplate } = useGetSpoilTemplateQuery();

  useEffect(() => {
    if (!spoilTemplate) {
      return;
    }

    setCertificateTemplate({
      id: spoilTemplate.id,
      code: spoilTemplate?.template?.name,
      name: certificateTemplate?.name || "Certificate Template",
      templateContent: spoilTemplate.template?.description || "",
      templateFileName: spoilTemplate.template?.fields[0]?.name || null,
    });
  }, [certificateTemplate?.name, setCertificateTemplate, spoilTemplate]);

  const resolvedTemplate = spoilTemplate
    ? {
        id: spoilTemplate.id,
        code: spoilTemplate?.template?.name,
        name: certificateTemplate?.name || "Certificate Template",
        templateContent: spoilTemplate.template?.description || "",
      }
    : certificateTemplate;

  const handleCustomize = () => {
    const spoilIdParam = spoilId ? `&spoilId=${spoilId}` : "";

    router.push(
      resolvedTemplate
        ? `/create-spoils/certificate-template/customize?flow=${selectedType}&mode=edit${spoilIdParam}`
        : `/create-spoils/certificate-template?flow=${selectedType}${spoilIdParam}`,
    );
  };

  return (
    <div className="rounded-2xl border border-[#E6EEF2] bg-[#F7FBFD] p-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-44 overflow-hidden rounded-xl">
            {resolvedTemplate?.templateContent ? (
              <CertificateTemplatePreview
                markup={resolvedTemplate.templateContent}
                title={resolvedTemplate.name || "Certificate template preview"}
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
        </div>

        <Button
          className="rounded-lg bg-[#003344] px-6 text-white hover:bg-[#002233]"
          onClick={handleCustomize}
        >
          {resolvedTemplate && (
            <Image src={editIcon} alt="Edit" width={24} height={23} />
          )}
          {resolvedTemplate ? "Edit Certificate" : "Customize Certificate"}
        </Button>
      </div>
    </div>
  );
};

export default CertificateSection;
