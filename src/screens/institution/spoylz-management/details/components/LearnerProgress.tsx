"use client";

import useGetLearnerSpoilProgressQuery from "@spt/hooks/apiRequests/useGetLearnerSpoilProgressQuery";

import StudentProgress from "../../../lecturers/details/components/spoylz/StudentProgress";
import { type LearnerRow, toLearnerProgress } from "../../mappers";

// One learner's progress on one Spoylz.
const LearnerProgress = ({
  spoilId,
  learner,
  simplified,
  subtitle = learner.name,
  onBack,
  onViewProfile,
}: {
  spoilId: number;
  learner: LearnerRow;
  simplified: boolean;
  // Shown above "Progress Details" when there's no profile button.
  subtitle?: string;
  onBack: () => void;
  onViewProfile?: () => void;
}) => {
  const { progress, isLoading, isError, errorMessage } = useGetLearnerSpoilProgressQuery(spoilId, learner.learnerId);

  if (progress) {
    return (
      <StudentProgress
        student={toLearnerProgress(learner, progress)}
        subtitle={subtitle}
        onBack={onBack}
        onViewProfile={onViewProfile}
        simplified={simplified}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-blue)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="var(--color-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Go Back
        </button>

        {/* The profile doesn't depend on the progress, so it stays reachable when progress fails. */}
        {onViewProfile && (
          <button
            type="button"
            onClick={onViewProfile}
            className="rounded-lg border border-[var(--color-blue)] px-4 py-2 text-sm font-medium text-[var(--color-blue)]"
          >
            View Learner&rsquo;s Profile
          </button>
        )}
      </div>

      {!onViewProfile && <p className="mt-4 text-gray-500">{subtitle}</p>}
      <h2 className={`${onViewProfile ? "mt-4" : "mt-1"} text-xl font-semibold text-[#212529]`}>Progress Details</h2>
      {isLoading ? (
        <div className="mt-5 h-[300px] animate-pulse rounded-2xl bg-[#F3F4F6]" />
      ) : (
        <div
          className={`mt-5 rounded-2xl border border-gray-100 bg-white p-6 text-sm sm:p-8 ${
            isError ? "text-red-600" : "text-gray-400"
          }`}
        >
          {isError ? errorMessage : "No progress recorded for this learner yet."}
        </div>
      )}
    </div>
  );
};

export default LearnerProgress;
