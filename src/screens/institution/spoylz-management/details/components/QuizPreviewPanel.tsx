"use client";

import { useState } from "react";

import { MOCK_QUIZ_QUESTIONS, QUIZ_SECTION_CONFIG, type QuizSection } from "./quizConstants";

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

const QuizIntro = ({ section, onStart }: { section: QuizSection; onStart: () => void }) => {
  const config = QUIZ_SECTION_CONFIG[section];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center sm:p-8">
      <PlayQuizBadge />

      <p className="mx-auto mt-5 max-w-xl text-sm text-gray-600">{config.intro}</p>

      <div className="mx-auto mt-5 max-w-xs space-y-3 text-left">
        <div className="flex items-center gap-2.5 text-sm text-[#212529]">
          <ClipboardIcon />
          {config.totalQuestions} Questions
        </div>
        <div className="flex items-center gap-2.5 text-sm text-[#212529]">
          <ClipboardIcon />
          {config.multipleChoice} Multiple choice
        </div>
        <div className="flex items-center gap-2.5 text-sm text-[#212529]">
          <ClipboardIcon />
          {config.fillInBlank} Fill in the blank
        </div>
        <div className="flex items-center gap-2.5 text-sm text-[#212529]">
          <ClockIcon />
          {config.minutes} Minutes
        </div>
      </div>

      <p className="mx-auto mt-5 max-w-xl text-sm text-gray-600">
        You must score at least <span className="font-semibold text-[#212529]">{config.passScore}%</span> to
        complete this Spoylz and receive your certificate.
      </p>

      <button
        type="button"
        onClick={onStart}
        className="mx-auto mt-6 block w-full max-w-md rounded-xl bg-[var(--color-blue)] py-3.5 text-sm font-semibold text-white"
      >
        View Quiz
      </button>
    </div>
  );
};

const QuizRunner = ({ section, onExit }: { section: QuizSection; onExit: () => void }) => {
  const config = QUIZ_SECTION_CONFIG[section];
  const questions = MOCK_QUIZ_QUESTIONS.slice(0, config.totalQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [furthestVisited, setFurthestVisited] = useState(0);

  const question = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setFurthestVisited((prev) => Math.max(prev, index));
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap gap-2">
        {questions.map((_, index) => {
          const isCurrent = index === currentIndex;
          const isVisited = index <= furthestVisited;
          return (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                isCurrent
                  ? "bg-[var(--color-blue)] text-white"
                  : isVisited
                    ? "border border-[var(--color-blue)] text-[var(--color-blue)]"
                    : "bg-[var(--color-blue-lightest)] text-[var(--color-blue-light)]"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Question <span className="font-semibold text-[#212529]">{currentIndex + 1}</span> of{" "}
          <span className="font-semibold text-[#212529]">{questions.length}</span>
        </p>
        <div className="flex items-center gap-1.5 text-sm font-medium text-[#212529]">
          <ClockIcon color="var(--color-yellow)" />
          00:{String(config.minutes).padStart(2, "0")}
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-[var(--color-blue-lightest)] px-4 py-3 text-sm font-medium text-[#212529]">
        {question.question}
      </div>

      {question.type === "multiple-choice" ? (
        <div className="mt-4 space-y-3">
          {question.options.map((option) => {
            const isCorrect = option === question.correctAnswer;
            return (
              <div
                key={option}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
                  isCorrect ? "border-[var(--color-green)] text-[#212529]" : "border-gray-200 text-[#212529]"
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
            value={question.correctAnswer}
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-[#212529] outline-none"
          />
        </div>
      )}

      <div className="mt-6 flex gap-4">
        {!isFirst && (
          <button
            type="button"
            onClick={() => goTo(currentIndex - 1)}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-[#212529]"
          >
            Previous
          </button>
        )}
        <button
          type="button"
          onClick={() => (isLast ? onExit() : goTo(currentIndex + 1))}
          className="flex-1 rounded-xl bg-[var(--color-blue)] py-3 text-sm font-semibold text-white"
        >
          {isLast ? "Finish Preview" : "Next"}
        </button>
      </div>
    </div>
  );
};

const QuizPreviewPanel = ({ section }: { section: QuizSection }) => {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <QuizIntro section={section} onStart={() => setStarted(true)} />;
  }

  return <QuizRunner section={section} onExit={() => setStarted(false)} />;
};

export default QuizPreviewPanel;
