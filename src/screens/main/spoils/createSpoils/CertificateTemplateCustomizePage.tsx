"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import ArrowLeftIcon from "@spt/assets/icons/arrow-left.svg";
import useCreateSpoilTemplateMutation from "@spt/hooks/apiRequests/useCreateSpoilTemplateMutation";
import useGetSpoilTemplateQuery from "@spt/hooks/apiRequests/useGetSpoilTemplateQuery";
import useUpdateSpoilTemplateMutation from "@spt/hooks/apiRequests/useUpdateSpoilTemplateMutation";
import { useAuthStore } from "@spt/store/authStore";
import useCreateSpoilStore from "@spt/store/createSpoilStore";

import CertificateCustomizationWorkspace from "./components/CertificateCustomizationWorkspace";
import CertificateSaveSuccessModal from "./components/CertificateSaveSuccessModal";
import {
  extractEmbeddedCertificateAssets,
  serializeCertificateMarkup,
} from "./components/certificateTemplateEditing";

const CERTIFICATE_TEMPLATE_FIELDS = [
  { name: "Title", type: "string" },
  { name: "Recipient Name", type: "string" },
  { name: "Body", type: "string" },
] as const;

export default function CertificateTemplateCustomizePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow") === "simple" ? "simple" : "advanced";
  const isEditMode = searchParams.get("mode") === "edit";
  const spoilIdParam = searchParams.get("spoilId");
  const hydratedTemplateIdRef = useRef<number | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const createdSpoilId = useAuthStore((state) => state.createdSpoilId);
  const resolvedSpoilId = spoilIdParam || createdSpoilId;

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
  const setCertificateTemplate = useCreateSpoilStore(
    (state) => state.setCertificateTemplate,
  );
  const { data: spoilTemplate, isLoading: isLoadingSpoilTemplate } =
    useGetSpoilTemplateQuery(undefined, {
      enabled: isEditMode,
    });
  const { createSpoilTemplateHandler, isLoading: isCreating } =
    useCreateSpoilTemplateMutation();
  const { updateSpoilTemplateHandler, isLoading: isUpdating } =
    useUpdateSpoilTemplateMutation();

  useEffect(() => {
    if (!isEditMode || !spoilTemplate) {
      return;
    }

    if (hydratedTemplateIdRef.current === spoilTemplate.id) {
      return;
    }

    const extractedAssets = extractEmbeddedCertificateAssets(
      spoilTemplate.template?.description || "",
      {
        logoPlacement: certificateCustomization.logoPlacement,
        signaturePlacement: certificateCustomization.signaturePlacement,
      },
    );

    setCertificateTemplate({
      id: spoilTemplate.id,
      code: spoilTemplate.template?.name || "",
      name: certificateTemplate?.name || "Certificate Template",
      templateContent: extractedAssets.cleanedMarkup,
      templateFileName: spoilTemplate.template?.fields[0]?.name || null,
    });

    setCertificateCustomization(extractedAssets.assets);
    hydratedTemplateIdRef.current = spoilTemplate.id;
  }, [
    certificateCustomization.logoPlacement,
    certificateCustomization.signaturePlacement,
    certificateTemplate?.name,
    isEditMode,
    setCertificateCustomization,
    setCertificateTemplate,
    spoilTemplate,
  ]);

  const resolvedCertificateTemplate = spoilTemplate
    ? (() => {
        const extractedAssets = extractEmbeddedCertificateAssets(
          spoilTemplate.template?.description || "",
          {
            logoPlacement: certificateCustomization.logoPlacement,
            signaturePlacement: certificateCustomization.signaturePlacement,
          },
        );

        return {
          id: spoilTemplate.id,
          code: spoilTemplate.template?.name || "",
          name: certificateTemplate?.name || "Certificate Template",
          templateContent: extractedAssets.cleanedMarkup,
          templateFileName: spoilTemplate.template?.fields[0]?.name || null,
        };
      })()
    : certificateTemplate;

  const getReviewRoute = () => {
    if (flow === "simple") {
      return `/create-spoils/simple-spoil${
        resolvedSpoilId ? `?spoilId=${resolvedSpoilId}` : ""
      }`;
    }

    return `/create-spoils/advance-spoil${
      resolvedSpoilId ? `?spoilId=${resolvedSpoilId}` : ""
    }`;
  };

  const handleBack = () => {
    router.push(
      isEditMode
        ? getReviewRoute()
        : `/create-spoils/certificate-template?flow=${flow}${
            spoilIdParam ? `&spoilId=${spoilIdParam}` : ""
          }`,
    );
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    router.push(getReviewRoute());
  };

  const handleSave = async () => {
    if (!resolvedCertificateTemplate) {
      router.push(
        `/create-spoils/certificate-template?flow=${flow}${
          spoilIdParam ? `&spoilId=${spoilIdParam}` : ""
        }`,
      );
      return;
    }

    if (!resolvedSpoilId) {
      toast.error("Create or load a spoil before saving its certificate.");
      return;
    }

    const templateContent = serializeCertificateMarkup(
      resolvedCertificateTemplate.templateContent,
      certificateCustomization.elementOverrides,
      {
        logoImage: certificateCustomization.logoImage,
        signatureImage: certificateCustomization.signatureImage,
        logoPlacement: certificateCustomization.logoPlacement,
        signaturePlacement: certificateCustomization.signaturePlacement,
      },
    );
    const certificateTemplateName =
      resolvedCertificateTemplate.templateFileName ||
      resolvedCertificateTemplate.name ||
      "certificate-template";
    const templatePayload = {
      template: {
        name: certificateTemplateName,
        description: templateContent,
        fields: [...CERTIFICATE_TEMPLATE_FIELDS],
      },
    };

    if (isEditMode) {
      await updateSpoilTemplateHandler(Number(resolvedSpoilId), templatePayload);
    } else {
      await createSpoilTemplateHandler({
        spoil_id: Number(resolvedSpoilId),
        ...templatePayload,
      });
    }

    setCertificateTemplate({
      ...resolvedCertificateTemplate,
      templateContent,
      templateFileName: certificateTemplateName,
    });

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        flow === "simple" ? "simple-spoil-step" : "advanced-spoil-step",
        flow === "simple" ? "review" : "2",
      );
    }

    setIsSuccessModalOpen(true);
  };

  if (isEditMode && isLoadingSpoilTemplate && !resolvedCertificateTemplate) {
    return null;
  }

  if (!resolvedCertificateTemplate) {
    router.push(
      `/create-spoils/certificate-template?flow=${flow}${
        spoilIdParam ? `&spoilId=${spoilIdParam}` : ""
      }`,
    );
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
          {isEditMode ? "Edit Certificate" : "Customize"}
        </h1>

        <CertificateCustomizationWorkspace
          certificateTemplate={resolvedCertificateTemplate}
          certificateCustomization={certificateCustomization}
          isSaving={isCreating || isUpdating}
          onUpdateCustomization={setCertificateCustomization}
          onUpdateTextElement={setCertificateElementOverride}
          onSave={handleSave}
        />

        <CertificateSaveSuccessModal
          open={isSuccessModalOpen}
          onClose={handleSuccessModalClose}
        />
      </div>
    </section>
  );
}
