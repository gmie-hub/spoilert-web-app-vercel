"use client";

import { useState } from "react";

import Button from "@spt/components/button";
import useGetCertificateTemplatesQuery, {
  type CertificateTemplate,
} from "@spt/hooks/apiRequests/useGetCertificateTemplatesQuery";
import useGetSpoilTemplateQuery from "@spt/hooks/apiRequests/useGetSpoilTemplateQuery";
import useUpdateSpoilTemplateMutation from "@spt/hooks/apiRequests/useUpdateSpoilTemplateMutation";
import CertificateTemplatePreview from "@spt/screens/main/spoils/createSpoils/components/CertificateTemplatePreview";
import { CERTIFICATE_TEMPLATE_FIELDS } from "@spt/utils/certificateTemplate";

import ModalShell from "./ModalShell";

const PREVIEW_FRAME = "relative overflow-hidden rounded-xl border border-gray-100 bg-white";

// "modern_blue.html" -> "modern blue"
const getTemplateName = (template: CertificateTemplate, index: number) => {
  const raw = template.template?.certificate_template_name?.trim();
  return raw ? raw.replace(/\.html$/i, "").replace(/[_-]+/g, " ").trim() : `Certificate Template ${index + 1}`;
};

const CertificateGallery = ({ spoilId, onBack }: { spoilId: number; onBack: () => void }) => {
  const { templates, isLoading, isError, errorMessage } = useGetCertificateTemplatesQuery();
  const { updateSpoilTemplateHandler } = useUpdateSpoilTemplateMutation();
  const [savingId, setSavingId] = useState<number | null>(null);

  const handleSelect = async (template: CertificateTemplate, index: number) => {
    setSavingId(template.id);
    try {
      await updateSpoilTemplateHandler(spoilId, {
        template: {
          name: template.template?.certificate_template_name || getTemplateName(template, index),
          description: template.template?.template_content ?? "",
          fields: CERTIFICATE_TEMPLATE_FIELDS.map((field) => ({ ...field })),
        },
      });
      onBack();
    } catch {
      // updateSpoilTemplateHandler has already shown the error.
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-blue)]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="var(--color-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Go Back
      </button>

      {isLoading ? (
        <div className="h-[320px] animate-pulse rounded-xl bg-[#F3F4F6]" />
      ) : isError ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : templates.length === 0 ? (
        <p className="text-sm text-gray-500">No certificate templates are available yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {templates.map((template, index) => (
            <div key={template.id} className="space-y-3 rounded-xl border border-gray-100 p-3">
              <CertificateTemplatePreview
                markup={template.template?.template_content ?? ""}
                title={getTemplateName(template, index)}
                useResponsiveScaling
                nativeCanvasSize
                outerClassName={PREVIEW_FRAME}
              />
              <p className="truncate text-sm font-medium capitalize text-[#212529]">{getTemplateName(template, index)}</p>
              <Button
                variant="blueOutline"
                className="w-full !py-2 text-sm"
                disabled={savingId !== null}
                onClick={() => handleSelect(template, index)}
              >
                {savingId === template.id ? "Saving..." : "Use This Certificate"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// The certificate a Spoylz issues, with the option to swap it for another template.
const CertificateModal = ({
  spoilId,
  spoilTitle,
  onClose,
}: {
  spoilId: number;
  spoilTitle: string;
  onClose: () => void;
}) => {
  const [isChoosing, setIsChoosing] = useState(false);
  const { data: spoilTemplate, isLoading, isError, errorMessage } = useGetSpoilTemplateQuery(spoilId);
  const markup = spoilTemplate?.template?.template_content || spoilTemplate?.template?.description || "";

  return (
    <ModalShell
      title={isChoosing ? "Choose Certificate" : "Certificate"}
      description={
        isChoosing
          ? "Pick the certificate learners get when they complete this Spoylz."
          : `Issued to learners who complete ${spoilTitle}`
      }
      onClose={onClose}
      widthClassName={isChoosing ? "max-w-[880px]" : "max-w-[640px]"}
    >
      {isChoosing ? (
        <CertificateGallery spoilId={spoilId} onBack={() => setIsChoosing(false)} />
      ) : (
        <div className="space-y-5">
          {isLoading ? (
            <div className="h-[420px] animate-pulse rounded-xl bg-[#F3F4F6]" />
          ) : isError ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : markup ? (
            <CertificateTemplatePreview
              markup={markup}
              title="Certificate preview"
              useResponsiveScaling
              nativeCanvasSize
              outerClassName={PREVIEW_FRAME}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-[#FBFBFB] py-10 text-center text-sm text-gray-500">
              No certificate has been set up for this Spoylz yet.
            </div>
          )}

          {!isLoading && !isError && (
            <Button variant="blueOutline" className="w-full" onClick={() => setIsChoosing(true)}>
              {markup ? "Change Certificate" : "Choose Certificate"}
            </Button>
          )}
        </div>
      )}
    </ModalShell>
  );
};

export default CertificateModal;
