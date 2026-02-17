import { FC } from "react";

import Button from "@spt/components/button";

interface ReviewActionButtonsProps {
  onPublish: () => void;
  onSchedulePremiere: () => void;
  onSaveToDraft: () => void;
}

const ReviewActionButtons: FC<ReviewActionButtonsProps> = ({
  onPublish,
  onSchedulePremiere,
  onSaveToDraft,
}) => {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <Button onClick={onPublish}>Publish Spoil</Button>

      <Button variant="outline" onClick={onSchedulePremiere}>
        Schedule Premiere
      </Button>

      <button
        onClick={onSaveToDraft}
        className="w-full py-2 font-semibold text-blue underline underline-offset-4"
      >
        Save To Draft
      </button>
    </div>
  );
};

export default ReviewActionButtons;
