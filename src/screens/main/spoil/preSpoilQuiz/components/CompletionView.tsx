"use client";

import Image from "next/image";

import ExcellentGif from "@spt/assets/images/excellent.gif";
import QuizGif from "@spt/assets/images/quiz.gif";
import Button from "@spt/components/button";
import type { QuizDetailsData } from "@spt/types/quiz";

import type { NormalizedQuestion } from "../helpers";

interface CompletionViewProps {
  correctAnswersCount: number;
  hasPassed: boolean;
  normalizedQuestions: NormalizedQuestion[];
  pageTitle: string;
  quizDetailsData?: QuizDetailsData;
  totalQuestionsCount: number;
  onRetry: () => void;
  onStartSpoil: () => void;
}

export const CompletionView = ({
  correctAnswersCount,
  hasPassed,
  normalizedQuestions,
  pageTitle,
  quizDetailsData,
  totalQuestionsCount,
  onRetry,
  onStartSpoil,
}: CompletionViewProps) => {
  const totalQuestions = totalQuestionsCount || normalizedQuestions.length;
  const passMark = quizDetailsData?.pass_mark;

  return (
    <div className="mx-auto mt-10 max-w-[650px]">
      <h1 className="text-lg font-semibold text-black sm:text-xl">
        {quizDetailsData?.title ?? pageTitle}
      </h1>

      <div className="mt-6 rounded-[20px] border border-[#E8E8E8] bg-white py-6 px-6 md:px-16 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-8">
        <div className="flex justify-center">
          <Image
            src={hasPassed ? ExcellentGif : QuizGif}
            alt={hasPassed ? "Quiz passed" : "Quiz not passed"}
            width={220}
            height={180}
            unoptimized
            priority
          />
        </div>

        <p className="text-black text-lg font-semibold">Your Score</p>

        <h2 className="mt-2 text-2xl font-semibold text-[#212529]">{`${correctAnswersCount}/${totalQuestions}`}</h2>

        {hasPassed ? (
          <p className="mx-auto mt-3 max-w-[520px] leading-7 text-black">
            Great job!👍 This was just to assess your current knowledge. Now,
            let&apos;s start learning
          </p>
        ) : (
          <p className="mx-auto mt-3 max-w-[520px] leading-7 text-black">
            You didn&apos;t reach the pass mark
            {passMark ? ` of ${passMark}%` : ""}. Please retake the quiz to
            continue.
          </p>
        )}

        {hasPassed ? (
          <Button
            variant="darkBlue"
            className="mt-8 w-full py-3"
            onClick={onStartSpoil}
          >
            Start Spoylz
          </Button>
        ) : (
          <Button
            variant="darkBlue"
            className="mt-8 w-full py-3"
            onClick={onRetry}
          >
            Retry Quiz
          </Button>
        )}
      </div>
    </div>
  );
};
