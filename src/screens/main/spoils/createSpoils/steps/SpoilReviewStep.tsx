"use client";

import { type FC } from "react";

import useGetSpoilByIdQuery from "@spt/hooks/apiRequests/getSpoilByIdQuery";
import { useAuthStore } from "@spt/store/authStore";
import useCreateSpoilStore from "@spt/store/createSpoilStore";

import SpoilReviewControls from "../components/SpoilReviewControls";

import CertificateSection from "./components/CertificateSection";
import SpoilBasicsSection from "./components/SpoilBasicsSection";
import SpoilOutlineSection from "./components/SpoilOutlineSection";
import { mapSpoilDataToForm } from "./spoilBasicsHelpers";

import type { BasicsFormData, OutlineData, SpoilTypeOption } from "../types";

interface SpoilReviewStepProps {
  // `basics` may be omitted — when present it's used only as a fallback
  basics?: BasicsFormData;
  outline: OutlineData;
  selectedType: SpoilTypeOption;
  onPrevious: () => void;
  onSubmit: () => void;
  // Assuming these are passed for the "Edit" functionality
  onEditBasics?: () => void;
  onEditOutline?: () => void;
}

const SpoilReviewStep: FC<SpoilReviewStepProps> = ({
  basics,
  outline,
  selectedType,
  onPrevious,
  onSubmit,
  onEditBasics,
  onEditOutline,
}) => {
  // Controls and publish/save/schedule logic moved to `SpoilReviewControls` component

  const storedSpoilId = useAuthStore((s) => s.createdSpoilId);
  const { data: spoilData } = useGetSpoilByIdQuery(storedSpoilId);

  // Prefer the API payload, fall back to `basics` prop, then persisted draft
  const storedBasics = useCreateSpoilStore((s) => s.basics);
  const displayBasics: BasicsFormData | undefined =
    spoilData != null
      ? mapSpoilDataToForm(spoilData)
      : (basics ?? storedBasics);

  // Prefer the API payload for outline, fall back to `outline` prop, then persisted draft
  const storedOutline = useCreateSpoilStore((s) => s.outline);
  const displayOutline = spoilData ?? outline ?? storedOutline;

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm md:max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Spoil Review</h2>
      </div>

      <CertificateSection />

      <div className="space-y-4">
        <p>Review the Spoil you created and publish</p>

        <SpoilBasicsSection
          basics={displayBasics as BasicsFormData}
          selectedType={selectedType}
          onEdit={onEditBasics}
        />

        {selectedType !== "simple" && (
          <SpoilOutlineSection
            outline={displayOutline as any}
            onEdit={onEditOutline}
          />
        )}
      </div>

      <SpoilReviewControls onPrevious={onPrevious} onSubmit={onSubmit} />
    </div>
  );
};

export default SpoilReviewStep;
