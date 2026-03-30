"use client";

import { type FC } from "react";

import SpoilReviewControls from "../components/SpoilReviewControls";

import CertificateSection from "./components/CertificateSection";
import SpoilBasicsSection from "./components/SpoilBasicsSection";
import SpoilOutlineSection from "./components/SpoilOutlineSection";

import type { BasicsFormData, OutlineData, SpoilTypeOption } from "../types";

interface SpoilReviewStepProps {
  basics: BasicsFormData;
  outline: OutlineData;
  selectedType: SpoilTypeOption;
  onPrevious: () => void;
  onSubmit: () => void;
  isEditMode?: boolean;
  spoilId?: number | string | null;
  onEditBasics?: () => void;
  onEditOutline?: () => void;
}

const SpoilReviewStep: FC<SpoilReviewStepProps> = ({
  basics,
  outline,
  selectedType,
  onPrevious,
  onSubmit,
  isEditMode = false,
  spoilId = null,
  onEditBasics,
  onEditOutline,
}) => {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm md:max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Spoil Review</h2>
      </div>

      <CertificateSection />

      <div className="space-y-4">
        <p>
          {isEditMode
            ? "Review your spoil changes and update"
            : "Review the Spoil you created and publish"}
        </p>

        <SpoilBasicsSection
          basics={basics}
          selectedType={selectedType}
          onEdit={onEditBasics}
        />

        {selectedType !== "simple" && (
          <SpoilOutlineSection
            outline={outline as any}
            onEdit={onEditOutline}
          />
        )}
      </div>

      <SpoilReviewControls
        isEditMode={isEditMode}
        spoilId={spoilId}
        selectedType={selectedType}
        onPrevious={onPrevious}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default SpoilReviewStep;
