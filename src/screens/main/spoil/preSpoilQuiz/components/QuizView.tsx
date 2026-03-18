"use client";

import Image from "next/image";

import ClockIcon from "@spt/assets/icons/blue-clock.svg";
import Button from "@spt/components/button";
import type { QuizDetailsData } from "@spt/types/quiz";

import {
  type NormalizedQuestion,
  formatTimer,
  getQuestionStatus,
} from "../helpers";

interface QuizViewProps {
  currentQuestion: NormalizedQuestion;
  currentQuestionIndex: number;
  isLastQuestion: boolean;
  isSubmitting?: boolean;
  normalizedQuestions: NormalizedQuestion[];
  quizDetailsData: QuizDetailsData;
  remainingSeconds: number | null;
  responses: Record<number, string>;
  visitedQuestions: number[];
  onChangeResponse: (value: string) => void;
  onGoToQuestion: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const QuizView = ({
  currentQuestion,
  currentQuestionIndex,
  isLastQuestion,
  isSubmitting = false,
  normalizedQuestions,
  quizDetailsData,
  remainingSeconds,
  responses,
  visitedQuestions,
  onChangeResponse,
  onGoToQuestion,
  onNext,
  onPrevious,
}: QuizViewProps) => (
  <div className="mx-auto mt-10 max-w-[650px]">
    <h1 className="text-lg font-semibold text-black sm:text-xl">
      {quizDetailsData.title}
    </h1>

    <div className="mt-6 rounded-[20px] border border-[#E8E8E8] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-8">
      <div className="flex flex-wrap gap-3">
        {normalizedQuestions.map((question, index) => {
          const questionStatus = getQuestionStatus({
            hasAnswer: Boolean(responses[question.id]?.trim()),
            index,
            isVisited: visitedQuestions.includes(index),
            currentIndex: currentQuestionIndex,
          });

          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onGoToQuestion(index)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-medium transition ${
                questionStatus === "active"
                  ? "border-[#013B4D] bg-[#013B4D] text-white"
                  : questionStatus === "visited"
                    ? "border-[#013B4D] bg-white text-[#013B4D]"
                    : "border-[#A7D4E1] bg-[#A7D4E1] text-white"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[15px] text-[#5F6368]">
          Question{" "}
          <span className="font-semibold text-[#212529]">
            {currentQuestionIndex + 1}
          </span>{" "}
          of {normalizedQuestions.length}
        </p>

        <div className="flex items-center gap-2 text-[#212529]">
          <Image src={ClockIcon} alt="Quiz timer" width={22} height={22} />
          <span className="text-sm font-medium">
            {formatTimer(remainingSeconds)}
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-[#DFF1F7] px-4 py-5 text-[17px] text-[#212529]">
        {currentQuestion.prompt}
      </div>

      {currentQuestion.type === "multiple_choice" ? (
        <div className="mt-6 space-y-4">
          {currentQuestion.options.map((option) => {
            const isSelected = responses[currentQuestion.id] === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => onChangeResponse(option)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left text-[15px] transition ${
                  isSelected
                    ? "border-[#013B4D] bg-[#F4FBFD]"
                    : "border-[#E7E7E7] bg-white"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    isSelected ? "border-[#013B4D]" : "border-[#9E9E9E]"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isSelected ? "bg-[#013B4D]" : "bg-transparent"
                    }`}
                  />
                </span>
                <span className="text-[#3B3B3B]">{option}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-6">
          <label
            htmlFor={`question-${currentQuestion.id}`}
            className="block text-base font-medium text-[#212529]"
          >
            Answer
          </label>
          <textarea
            id={`question-${currentQuestion.id}`}
            value={responses[currentQuestion.id] ?? ""}
            onChange={(event) => onChangeResponse(event.target.value)}
            placeholder="Type in your answer here"
            rows={4}
            className="mt-3 w-full rounded-2xl border border-[#E7E7E7] px-4 py-4 text-[15px] text-[#212529] outline-none placeholder:text-[#B3B3B3]"
          />
        </div>
      )}

      <Button
        variant="darkBlue"
        className="mt-7 w-full py-3"
        disabled={isSubmitting}
        onClick={onNext}
      >
        {isLastQuestion && isSubmitting
          ? "Submitting..."
          : isLastQuestion
            ? "Submit and End Quiz"
            : "Next"}
      </Button>

      {currentQuestionIndex > 0 && (
        <Button
          variant="outline"
          className="mt-4 w-full py-3"
          onClick={onPrevious}
        >
          Previous
        </Button>
      )}
    </div>
  </div>
);
