"use client";

import type { FC } from "react";

import Image from "next/image";

import EmptyImageIcon from "@spt/assets/icons/Empty Image.svg";
import { Card } from "@spt/components";
import Button from "@spt/components/button";

interface QuestionEmptyStateProps {
  onAddQuestion: () => void;
  onPrevious: () => void;
}

const QuestionEmptyState: FC<QuestionEmptyStateProps> = ({
  onAddQuestion,
  onPrevious,
}) => {
  return (
    <Card className="rounded-3xl md:max-w-2xl">
      <div className="space-y-7">
        <h2 className="text-xl font-semibold text-[#212121]">Add Questions</h2>

        <div className="flex flex-col items-center text-center">
          <Image
            src={EmptyImageIcon}
            alt="No questions added"
            width={133}
            height={158}
            className="h-auto w-[133px]"
            priority
          />

          <h3 className="mt-6 text-lg font-semibold text-[#212121] md:text-xl">
            No Question Has Been Added Yet
          </h3>
          <p className="mt-2 text-[#5A5A5A] text-sm md:text-base">
            Add questions to create your quiz
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <Button
            type="button"
            variant="darkBlue"
            className="w-full !rounded-2xl !bg-[#013B4D] font-semibold text-white hover:!bg-[#0D4F63]"
            onClick={onAddQuestion}
          >
            Add Questions
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full !rounded-2xl !border-[#DADADA] font-semibold !text-[#013B4D] hover:!bg-[#013B4D] hover:!text-white"
            onClick={onPrevious}
          >
            Previous
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuestionEmptyState;
