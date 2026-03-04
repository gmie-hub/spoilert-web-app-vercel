"use client";

import type { FC } from "react";

import Image from "next/image";
import { FiPlus } from "react-icons/fi";

import EditIcon from "@spt/assets/icons/gray-edit.svg";
import TrashIcon from "@spt/assets/icons/trash.svg";
import { Card } from "@spt/components";
import Button from "@spt/components/button";

import { getQuestionTypeLabel } from "../questionHelpers";

import type { QuizQuestion } from "../types";

interface QuestionOutlineListProps {
  onAddQuestion: () => void;
  onDeleteQuestion: (questionId: string) => void;
  onEditQuestion: (questionId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  questions: QuizQuestion[];
}

const QuestionOutlineList: FC<QuestionOutlineListProps> = ({
  onAddQuestion,
  onDeleteQuestion,
  onEditQuestion,
  onNext,
  onPrevious,
  questions,
}) => {
  return (
    <Card className="rounded-3xl md:max-w-2xl">
      <div className="space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-black">Spoil Outline</h2>

          <Button
            type="button"
            variant="darkBlue"
            className="!rounded-2xl !bg-[#013B4D] !px-6 font-semibold text-white hover:!bg-[#0D4F63]"
            iconLeft={<FiPlus className="h-6 w-6" />}
            onClick={onAddQuestion}
          >
            Add Question
          </Button>
        </div>

        <div className="space-y-5">
          {questions.map((question, index) => (
            <div key={question.id} className="border-b border-[#E3E3E3] pb-2">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <p className="font-medium text-black">
                    Q{index + 1}. {question.prompt}
                  </p>
                  <p className="text-gray-dark text-sm">
                    {getQuestionTypeLabel(question.type)}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <button
                    type="button"
                    onClick={() => onDeleteQuestion(question.id)}
                    className="text-[#E53935] transition hover:text-[#C62828]"
                    aria-label={`Delete question ${index + 1}`}
                  >
                    <Image src={TrashIcon} alt="Delete Question" width={16} height={16} className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditQuestion(question.id)}
                    className="text-[#5A5A5A] transition hover:text-[#212121]"
                    aria-label={`Edit question ${index + 1}`}
                  >
                    <Image src={EditIcon} alt="Edit Question" width={16} height={16} className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 pt-2">
          <Button
            type="button"
            variant="darkBlue"
            className="w-full !rounded-2xl !bg-[#013B4D] font-semibold text-white hover:!bg-[#0D4F63]"
            onClick={onNext}
          >
            Save And Continue
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

export default QuestionOutlineList;
