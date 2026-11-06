"use client";

import { useState } from "react";

import { useGetQuizDetailsQuery } from "@spt/hooks/apiRequests/useGetQuizDetailsQuery";
import type { QuizDetailsData } from "@spt/types/quiz";

import { FILL_IN_THE_BLANK, MULTIPLE_CHOICE, parseQuizOptions } from "../../mappers";

const DEFAULT_INTROS: Record<string, string> = {
  pre: "Learners take this quiz before they start the Spoylz, to show what they already know.",
  post: "Learners take this quiz after they finish the Spoylz, to test what they have learned.",
  module: "Learners take this quiz at the end of the module, to check what they have just learned.",
};

const ClipboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="5" y="4" width="14" height="17" rx="2" stroke="var(--color-blue)" strokeWidth="1.6" />
    <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="var(--color-blue)" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8.5 11h7M8.5 15h5" stroke="var(--color-blue)" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const ClockIcon = ({ color = "var(--color-blue)" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" />
    <path d="M12 7v5l3.5 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9.3" fill="var(--color-green)" />
    <path d="M8 12.3l2.6 2.6L16.2 9" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlayQuizBadge = () => (
  <div className="relative mx-auto flex h-28 w-32 items-center justify-center">
    <span className="absolute inset-1 rotate-12 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400" />
    <span className="absolute inset-1 -rotate-12 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400" />
    <div className="relative flex flex-col items-center leading-none">
      <span className="-mb-1 -rotate-6 text-sm font-bold italic text-pink-600">Play</span>
      <span
        className="text-2xl font-extrabold tracking-wide text-[#1a1a2e]"
        style={{ WebkitTextStroke: "1px white" }}
      >
        QUIZ!
      </span>
    </div>
  </div>
);

const QuizIntro = ({ quiz, onStart }: { quiz: QuizDetailsData; onStart: () => void }) => {
  const questions = quiz.questions ?? [];
  const multipleChoice = questions.filter((question) => question.type === MULTIPLE_CHOICE).length;
  const fillInBlank = questions.filter((question) => question.type === FILL_IN_THE_BLANK).length;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center sm:p-8">
      <PlayQuizBadge />

      <h3 className="mt-5 text-lg font-semibold text-[#212529]">{quiz.title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
        {quiz.description || DEFAULT_INTROS[quiz.type] || DEFAULT_INTROS.module}
      </p>

      <div className="mx-auto mt-5 max-w-xs space-y-3 text-left">
        <div className="flex items-center gap-2.5 text-sm text-[#212529]">
          <ClipboardIcon />
          {questions.length} Questions
        </div>
        <div className="flex items-center gap-2.5 text-sm text-[#212529]">
          <ClipboardIcon />
          {multipleChoice} Multiple choice
        </div>
        <div className="flex items-center gap-2.5 text-sm text-[#212529]">
          <ClipboardIcon />
          {fillInBlank} Fill in the blank
        </div>
        <div className="flex items-center gap-2.5 text-sm text-[#212529]">
          <ClockIcon />
          {quiz.time_limit ?? "-"} Minutes
        </div>
      </div>

      {quiz.pass_mark != null && (
        <p className="mx-auto mt-5 max-w-xl text-sm text-gray-600">
          Learners must score at least <span className="font-semibold text-[#212529]">{quiz.pass_mark}%</span> to
          pass this quiz.
        </p>
      )}

      <div className="mx-auto mt-6 max-w-md">
        <button
          type="button"
          onClick={onStart}
          disabled={questions.length === 0}
          className="w-full rounded-xl bg-[var(--color-blue)] py-3.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {questions.length === 0 ? "No Questions Yet" : "View Quiz"}
        </button>
      </div>
    </div>
  );
};

const QuizRunner = ({ quiz, onExit }: { quiz: QuizDetailsData; onExit: () => void }) => {
  const questions = quiz.questions ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [furthestVisited, setFurthestVisited] = useState(0);

  const index = Math.min(currentIndex, questions.length - 1);
  const question = questions[index];
  const isFirst = index === 0;
  const isLast = index === questions.length - 1;
  const options = parseQuizOptions(question?.options);

  const goTo = (next: number) => {
    setCurrentIndex(next);
    setFurthestVisited((prev) => Math.max(prev, next));
  };

  if (!question) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap gap-2">
        {questions.map((item, position) => {
          const isCurrent = position === index;
          const isVisited = position <= furthestVisited;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(position)}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                isCurrent
                  ? "bg-[var(--color-blue)] text-white"
                  : isVisited
                    ? "border border-[var(--color-blue)] text-[var(--color-blue)]"
                    : "bg-[var(--color-blue-lightest)] text-[var(--color-blue-light)]"
              }`}
            >
              {position + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Question <span className="font-semibold text-[#212529]">{index + 1}</span> of{" "}
          <span className="font-semibold text-[#212529]">{questions.length}</span>
        </p>
        <div className="flex items-center gap-1.5 text-sm font-medium text-[#212529]">
          <ClockIcon color="var(--color-yellow)" />
          {quiz.time_limit ?? "-"} min
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-[var(--color-blue-lightest)] px-4 py-3 text-sm font-medium text-[#212529]">
        {question.question}
      </div>

      {question.type === MULTIPLE_CHOICE ? (
        <div className="mt-4 space-y-3">
          {options.map((option, position) => {
            const isCorrect = option === question.answer;
            return (
              <div
                key={`${option}-${position}`}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-[#212529] ${
                  isCorrect ? "border-[var(--color-green)]" : "border-gray-200"
                }`}
              >
                {isCorrect ? (
                  <CheckCircleIcon />
                ) : (
                  <span className="h-4 w-4 shrink-0 rounded-full border border-gray-300" />
                )}
                {option}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4">
          <p className="mb-2 text-sm text-gray-400">Answer</p>
          <textarea
            readOnly
            value={question.answer ?? ""}
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-[#212529] outline-none"
          />
        </div>
      )}

      <div className="mt-6 flex gap-4">
        {!isFirst && (
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-[#212529]"
          >
            Previous
          </button>
        )}
        <button
          type="button"
          onClick={() => (isLast ? onExit() : goTo(index + 1))}
          className="flex-1 rounded-xl bg-[var(--color-blue)] py-3 text-sm font-semibold text-white"
        >
          {isLast ? "Finish Preview" : "Next"}
        </button>
      </div>
    </div>
  );
};

// Read-only preview: institutions can look through a quiz but not edit it.
const QuizPreviewPanel = ({ quizId }: { quizId: number }) => {
  const [started, setStarted] = useState(false);
  const {
    quizDetailsData: quiz,
    isQuizDetailsLoading,
    isQuizDetailsError,
    quizDetailsErrorMessage,
  } = useGetQuizDetailsQuery(quizId);

  if (isQuizDetailsLoading) {
    return <div className="h-[420px] animate-pulse rounded-2xl bg-[#F3F4F6]" />;
  }

  if (isQuizDetailsError || !quiz) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-red-600 sm:p-8">
        {quizDetailsErrorMessage}
      </div>
    );
  }

  return started && (quiz.questions ?? []).length > 0 ? (
    <QuizRunner quiz={quiz} onExit={() => setStarted(false)} />
  ) : (
    <QuizIntro quiz={quiz} onStart={() => setStarted(true)} />
  );
};

export default QuizPreviewPanel;
