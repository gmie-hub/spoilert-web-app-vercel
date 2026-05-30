"use client";

import type { FC } from "react";

import { FiPlus } from "react-icons/fi";

import Button from "@spt/components/button";

import type { QuizConfig } from "../types";

interface QuizSectionProps {
  preQuiz?: QuizConfig;
  postQuiz?: QuizConfig;
  onEditPreQuiz: () => void;
  onEditPostQuiz: () => void;
}

const QuizSection: FC<QuizSectionProps> = ({
  preQuiz,
  postQuiz,
  onEditPreQuiz,
  onEditPostQuiz,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-[#FDFDFE] p-6">
      <p className="text-sm text-gray-600">
        Create pre-Spoylz and post-Spoylz quizzes so you can track your learner&apos;s
        progress before and after taking the Spoylz.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="justify-between"
          onClick={onEditPreQuiz}
        >
          {preQuiz ? "Edit Pre-Spoylz Quiz" : "Create Pre-Spoylz Quiz"}
          <FiPlus />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="justify-between"
          onClick={onEditPostQuiz}
        >
          {postQuiz ? "Edit Post-Spoylz Quiz" : "Create Post-Spoylz Quiz"}
          <FiPlus />
        </Button>
      </div>

    </div>
  );
};

export default QuizSection;
