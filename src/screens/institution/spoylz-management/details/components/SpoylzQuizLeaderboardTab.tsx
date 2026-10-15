"use client";

import { useState } from "react";

import { useGetQuizBySpoilId } from "@spt/hooks/apiRequests/useGetQuizBySpoilId";
import type { QuizDatum } from "@spt/types/quiz";
import type { SpoilDetailsData } from "@spt/utils/spoils";

import QuizPreviewPanel from "./QuizPreviewPanel";

const LEADERBOARD = "leaderboard";
type Section = number | typeof LEADERBOARD;

// Pre-Spoylz first, then each module's quiz in module order, then Post-Spoylz.
const quizOrder = (quiz: QuizDatum, moduleIds: number[]) => {
  if (quiz.type === "pre") return -1;
  if (quiz.type === "post") return Number.MAX_SAFE_INTEGER;
  const position = moduleIds.indexOf(quiz.module_id ?? -1);
  return position === -1 ? moduleIds.length : position;
};

// Module quizzes are named after the position of the module they belong to.
const getQuizLabel = (quiz: QuizDatum, moduleIds: number[]) => {
  if (quiz.type === "pre") return "Pre-Spoylz Quiz";
  if (quiz.type === "post") return "Post-Spoylz Quiz";
  const position = moduleIds.indexOf(quiz.module_id ?? -1);
  return position === -1 ? "Module Quiz" : `Module ${position + 1} Quiz`;
};

const ChevronRightIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 6l6 6-6 6"
      stroke={active ? "var(--color-blue)" : "#9CA3AF"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// No endpoint serves quiz rankings yet.
const LeaderboardPanel = () => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
    <h3 className="text-lg font-semibold text-[#212529]">Leaderboard</h3>
    <p className="mt-2 text-sm text-gray-400">No leaderboard is available for this Spoylz yet.</p>
  </div>
);

const SpoylzQuizLeaderboardTab = ({ spoil }: { spoil: SpoilDetailsData }) => {
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const { quizData, isQuizLoading, isError, quizErrorMessage } = useGetQuizBySpoilId(spoil.id);

  const moduleIds = (spoil.modules ?? []).map((module) => module.id);
  const quizzes = [...(quizData ?? [])].sort((a, b) => quizOrder(a, moduleIds) - quizOrder(b, moduleIds));
  const currentSection = activeSection ?? quizzes[0]?.id ?? LEADERBOARD;

  const sections: { id: Section; label: string }[] = [
    ...quizzes.map((quiz) => ({ id: quiz.id, label: getQuizLabel(quiz, moduleIds) })),
    { id: LEADERBOARD, label: "Leaderboard" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <div className="h-fit rounded-2xl border border-gray-100 bg-white p-4">
        {isQuizLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, index) => (
              <span key={index} className="block h-10 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : (
          <>
            {isError && <p className="px-4 pb-3 text-sm text-red-600">{quizErrorMessage}</p>}
            {!isError && quizzes.length === 0 && (
              <p className="px-4 pb-3 text-sm text-gray-400">This Spoylz has no quizzes yet.</p>
            )}
            {sections.map((section) => {
              const active = section.id === currentSection;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium ${
                    active ? "bg-[var(--color-blue-lightest)] text-[var(--color-blue)]" : "text-[#212529] hover:bg-gray-50"
                  }`}
                >
                  {section.label}
                  <ChevronRightIcon active={active} />
                </button>
              );
            })}
          </>
        )}
      </div>

      {currentSection === LEADERBOARD ? (
        <LeaderboardPanel />
      ) : (
        <QuizPreviewPanel key={currentSection} quizId={currentSection} />
      )}
    </div>
  );
};

export default SpoylzQuizLeaderboardTab;
