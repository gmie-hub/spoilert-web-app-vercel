"use client";

import { FiCheck, FiClock, FiX } from "react-icons/fi";

import type { QuizStatus } from "./startSpoilUtils";

interface QuizStatusBadgeProps {
  status: QuizStatus;
}

/**
 * "Done" once the learner has passed the quiz, "Not passed" when they took it
 * but missed the pass mark, and "Not taken" before their first attempt.
 */
const QuizStatusBadge = ({ status }: QuizStatusBadgeProps) => {
  if (!status.exists) return null;

  const { icon, label, tone } = status.isPassed
    ? {
        icon: <FiCheck size={12} />,
        label: "Done",
        tone: "bg-[#ECFDF5] text-[#065F46]",
      }
    : status.isTaken
      ? {
          icon: <FiClock size={12} />,
          label: "Not passed",
          tone: "bg-[#FFF7ED] text-[#9A6A2B]",
        }
      : {
          icon: <FiX size={12} />,
          label: "Not taken",
          tone: "bg-[#F2F4F5] text-[#7C8792]",
        };

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}`}
    >
      {icon}
      {label}
    </span>
  );
};

export default QuizStatusBadge;
