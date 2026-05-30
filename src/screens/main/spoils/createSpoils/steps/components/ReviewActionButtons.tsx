import { FC } from "react";

import Button from "@spt/components/button";

interface ReviewActionButtonsProps {
  onPublish: () => void;
  onSchedulePremiere: () => void;
  onSaveToDraft: () => void;
  isSavingDraft?: boolean;
  isPublishing?: boolean;
  isScheduling?: boolean;
}

const ReviewActionButtons: FC<ReviewActionButtonsProps> = ({
  onPublish,
  onSchedulePremiere,
  onSaveToDraft,
  isSavingDraft = false,
  isPublishing = false,
  isScheduling = false,
}) => {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <Button onClick={onPublish} disabled={isPublishing}>
        {isPublishing ? "Loading..." : "Publish Spoylz"}
      </Button>

      <Button variant="outline" onClick={onSchedulePremiere} disabled={isScheduling}>
        {isScheduling ? "Loading..." : "Schedule Premiere"}
      </Button>

      <button
        onClick={onSaveToDraft}
        disabled={isSavingDraft}
        aria-busy={isSavingDraft}
        className={`w-full py-2 font-semibold text-blue underline underline-offset-4 ${
          isSavingDraft ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {isSavingDraft ? "Loading..." : "Save To Draft"}
      </button>
    </div>
  );
};

export default ReviewActionButtons;
