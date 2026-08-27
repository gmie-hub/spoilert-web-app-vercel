"use client";

import QuizStatusBadge from "./QuizStatusBadge";
import {
  type QuizStatus,
  type SpoilQuiz,
  formatQuizScore,
} from "./startSpoilUtils";

/** "Completed" / "Taken, pass mark not reached" / "Not taken" in words. */
const getStateLabel = (status: QuizStatus, subject: string) => {
  if (status.isPassed) return `${subject} completed`;
  if (status.isTaken) return `${subject} taken, pass mark not reached`;

  return `${subject} not taken`;
};

const getScoreLine = (status: QuizStatus) => {
  const score = status.isTaken ? formatQuizScore(status.highestScore) : null;

  if (!score) return null;

  const passMark = formatQuizScore(status.passMark);

  return passMark
    ? `Best score ${score} (pass mark ${passMark})`
    : `Best score ${score}`;
};

interface PreSpoilQuizRowProps {
  quiz: SpoilQuiz;
  status: QuizStatus;
}

/** Pre-Spoylz quiz state, shown at the top of the Spoylz Content panel. */
export const PreSpoilQuizRow = ({ quiz, status }: PreSpoilQuizRowProps) => {
  const scoreLine = getScoreLine(status);

  return (
    <div className="mt-5 flex items-start justify-between gap-3 rounded-[16px] border border-[#E9E9E9] bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs text-[#9CA3AF]">Pre-Spoylz Quiz</p>
        <p className="mt-1 truncate text-[15px] font-medium text-[#212529]">
          {quiz.title || "Pre-Spoylz Quiz"}
        </p>
        <p className="mt-1 text-xs text-[#7C8792]">
          {getStateLabel(status, "Quiz")}
        </p>

        {scoreLine && (
          <p className="mt-1 text-xs text-[#9CA3AF]">{scoreLine}</p>
        )}
      </div>

      <QuizStatusBadge status={status} />
    </div>
  );
};

interface ModuleQuizStatusRowProps {
  status: QuizStatus;
}

/** Module quiz state, shown inside the module it belongs to. */
export const ModuleQuizStatusRow = ({ status }: ModuleQuizStatusRowProps) => {
  if (!status.exists) return null;

  const scoreLine = getScoreLine(status);

  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#EEF1F3] bg-[#FCFCFC] px-4 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-xs text-[#7C8792]">
          {getStateLabel(status, "Module quiz")}
        </p>

        {scoreLine && (
          <p className="mt-0.5 truncate text-xs text-[#9CA3AF]">{scoreLine}</p>
        )}
      </div>

      <QuizStatusBadge status={status} />
    </div>
  );
};
