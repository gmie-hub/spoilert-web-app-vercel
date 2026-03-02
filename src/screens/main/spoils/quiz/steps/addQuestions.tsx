"use client";

import type { FC } from "react";

import Image from "next/image";

import EmptyImageIcon from "@spt/assets/icons/Empty Image.svg";
import { Card } from "@spt/components";
import Button from "@spt/components/button";

interface AddQuestionsProps {
  onPrevious: () => void;
  onAddQuestions: () => void;
}

const AddQuestions: FC<AddQuestionsProps> = ({ onPrevious, onAddQuestions }) => {
  return (
    <Card className="rounded-3xl bg-[#F8F8F8]">
      <div className="space-y-7">
        <h2 className="text-3xl font-semibold text-[#212121]">Add Questions</h2>

        <div className="flex flex-col items-center text-center">
          <Image
            src={EmptyImageIcon}
            alt="No questions added"
            width={133}
            height={158}
            className="h-auto w-[133px]"
            priority
          />

          <h3 className="mt-6 text-2xl font-semibold text-[#212121] md:text-4xl">
            No Question Has Been Added Yet
          </h3>
          <p className="mt-2 text-lg text-[#5A5A5A] md:text-2xl">
            Add questions to create your quiz
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <Button
            type="button"
            variant="darkBlue"
            className="w-full !rounded-2xl !bg-[#013B4D] !py-4 text-xl font-semibold text-white hover:!bg-[#0D4F63]"
            onClick={onAddQuestions}
          >
            Add Questions
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full !rounded-2xl !border-[#DADADA] !py-4 text-xl font-semibold !text-[#013B4D] hover:!bg-[#013B4D] hover:!text-white"
            onClick={onPrevious}
          >
            Previous
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AddQuestions;
