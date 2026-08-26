"use client";

import { FaBan } from "react-icons/fa";
import { FiCheckCircle, FiLock } from "react-icons/fi";

import Button from "@spt/components/button";

import QuizStatusBadge from "./QuizStatusBadge";
import { type QuizStatus, formatQuizScore } from "./startSpoilUtils";

interface PostSpoilQuizPanelProps {
  /** Every lesson is complete, so the quiz is unlocked. */
  canTakeQuiz: boolean;
  status: QuizStatus;
  onTakeQuiz: () => void;
}

/**
 * The post-Spoylz quiz card in the Spoylz Content panel. Once the learner has
 * taken and passed it the CTA turns into a "taken" indicator; an attempt that
 * missed the pass mark keeps the CTA but offers a retake.
 */
const PostSpoilQuizPanel = ({
  canTakeQuiz,
  status,
  onTakeQuiz,
}: PostSpoilQuizPanelProps) => {
  if (!status.exists) return null;

  const score = formatQuizScore(status.highestScore);
  const passMark = formatQuizScore(status.passMark);

  return (
    <div className="mt-5 rounded-[16px] border border-[#B7DCE8] bg-[#EAF7FB] px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <p className="flex items-start gap-3 text-sm leading-6 text-[#5A6A73]">
          {status.isTaken ? (
            <FiCheckCircle className="mt-1 shrink-0 text-[#0E9F6E]" size={16} />
          ) : (
            <FiLock className="mt-1 shrink-0 text-[#7C93A0]" size={16} />
          )}
          <span>
            <span className="font-medium text-[#4B5C65]">Post Spoylz Quiz</span>{" "}
            -{" "}
            {status.isPassed
              ? `You have taken and passed it${score ? ` with ${score}` : ""}.`
              : status.isTaken
                ? `You have taken it${score ? ` and scored ${score}` : ""}, but have not reached the pass mark${passMark ? ` of ${passMark}` : ""}.`
                : canTakeQuiz
                  ? "You have unlocked the post-Spoylz quiz."
                  : "You have to complete all modules to unlock your certificate"}
          </span>
        </p>

        <QuizStatusBadge status={status} />
      </div>

      {status.isPassed ? (
        <p className="mt-4 w-full rounded-[12px] bg-[#ECFDF5] py-3 text-center text-sm font-semibold text-[#065F46]">
          Post-Spoylz Quiz Taken
        </p>
      ) : (
        <div className="group relative w-full">
          <Button
            variant="darkBlue"
            disabled={!canTakeQuiz}
            onClick={onTakeQuiz}
            className={`mt-4 w-full rounded-[12px] py-3 text-white ${
              !canTakeQuiz ? "cursor-not-allowed bg-[#8FB0BA]" : ""
            }`}
          >
            {status.isTaken
              ? "Retake Post-Spoylz Quiz"
              : "Take Post-Spoylz Quiz"}
          </Button>

          {!canTakeQuiz && (
            <FaBan className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 text-red-500 text-lg group-hover:block" />
          )}
        </div>
      )}
    </div>
  );
};

export default PostSpoilQuizPanel;
