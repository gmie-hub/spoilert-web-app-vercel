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
        Create pre-spoil and post-spoil quizzes so you can track your learner's
        progress before and after taking the spoil.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="justify-between"
          onClick={onEditPreQuiz}
        >
          {preQuiz ? "Edit Pre-Spoil Quiz" : "Create Pre-Spoil Quiz"}
          <FiPlus />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="justify-between"
          onClick={onEditPostQuiz}
        >
          {postQuiz ? "Edit Post-Spoil Quiz" : "Create Post-Spoil Quiz"}
          <FiPlus />
        </Button>
      </div>
      <div className="mt-4 grid gap-4 text-xs text-gray-500 md:grid-cols-2">
        {preQuiz && (
          <p>
            Saved pre-spoil quiz:{" "}
            <span className="font-medium text-gray-800">{preQuiz.title}</span>
          </p>
        )}
        {postQuiz && (
          <p>
            Saved post-spoil quiz:{" "}
            <span className="font-medium text-gray-800">{postQuiz.title}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default QuizSection;
