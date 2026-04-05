"use client";

import type { FC } from "react";
import { useCallback } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import EditIcon from "@spt/assets/icons/white-edit.svg";
import { Card } from "@spt/components";
import Button from "@spt/components/button";

import { getQuestionTypeLabel } from "../questionHelpers";

import type { QuizOverviewDraft, QuizQuestion } from "../types";


interface ReviewProps {
  overview: QuizOverviewDraft;
  questions: QuizQuestion[];
  onEditOverview: () => void;
  onEditQuestions: () => void;
  onPublish?: () => Promise<void> | void;
}

const Review: FC<ReviewProps> = ({
  overview,
  questions,
  onEditOverview,
  onEditQuestions,
  onPublish,
}) => {
  const router = useRouter();

  const handlePublish = useCallback(async () => {
    if (!onPublish) return;
    try {
      await onPublish();
      router.back();
    } catch (e) {
      // keep original behavior: don't navigate on failure
      // eslint-disable-next-line no-console
      console.error("Publish failed:", e);
    }
  }, [onPublish, router]);
  return (
    <Card className="rounded-3xl md:max-w-2xl">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-black">Quiz Review</h2>

        <div className="space-y-4">
          <SectionHeader title="Overview" onEdit={onEditOverview} />

          <div className="space-y-4 border-b border-[#E3E3E3] pb-4">
            <div className="space-y-2">
              <p className="text-sm text-[#999B9D]">Quiz Title</p>
              <p className="text-lg text-black">{overview.title || "-"}</p>
            </div>

            <div className="border-t border-[#E3E3E3] pt-4">
              <p className="text-sm text-[#999B9D]">Description</p>
              <p className="mt-2 text-lg text-black">
                {overview.description || "-"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 border-t border-[#E3E3E3] pt-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-[#999B9D]">Number of Questions</p>
                <p className="mt-2 text-lg text-black">
                  {overview.numberOfQuestions || "0"}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#999B9D]">Time Limit</p>
                <p className="mt-2 text-lg text-black">
                  {overview.timeLimit ? `${overview.timeLimit} Minutes` : "-"}
                </p>
              </div>
              {overview.passmark !== undefined && (
                <div>
                  <p className="text-sm text-[#999B9D]">Passmark</p>
                  <p className="mt-2 text-lg text-black">
                    {overview.passmark || "-"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader title="Questions" onEdit={onEditQuestions} />

          {questions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DADADA] bg-[#FBFBFB] px-4 py-6 text-center text-sm text-[#5A5A5A]">
              No questions added yet
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border-b border-[#E3E3E3] pb-4 last:border-b-0"
                >
                  <p className="font-medium text-black">
                    Q{index + 1}. {question.prompt}
                  </p>
                  <p className="mt-2 text-sm text-gray-dark">
                    {getQuestionTypeLabel(question.type)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="darkBlue"
          onClick={handlePublish}
          className="w-full !rounded-2xl !bg-[#013B4D] font-semibold text-white hover:!bg-[#0D4F63]"
        >
          Publish Quiz
        </Button>
      </div>
    </Card>
  );
};

interface SectionHeaderProps {
  title: string;
  onEdit: () => void;
}

const SectionHeader: FC<SectionHeaderProps> = ({ title, onEdit }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[var(--color-blue-lightest)] px-4 py-2">
      <h3 className="text-lg font-semibold text-[#013B4D]">{title}</h3>
      <Button
        type="button"
        variant="darkBlue"
        onClick={onEdit}
        className="!h-9 !rounded-xl !px-4 !py-0 text-sm font-semibold text-white"
        iconLeft={<Image src={EditIcon} alt="Edit" width={16} height={16} className="h-4 w-4" />}
      >
        Edit
      </Button>
    </div>
  );
};

export default Review;
