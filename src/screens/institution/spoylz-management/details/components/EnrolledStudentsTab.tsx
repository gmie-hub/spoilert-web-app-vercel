"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import useGetLearnerSpoilProgressQuery from "@spt/hooks/apiRequests/useGetLearnerSpoilProgressQuery";
import useGetSpoilLearnersQuery from "@spt/hooks/apiRequests/useGetSpoilLearnersQuery";

import EnrolledStudentsTable from "../../../lecturers/details/components/spoylz/EnrolledStudentsTable";
import StudentProgress from "../../../lecturers/details/components/spoylz/StudentProgress";
import { type LearnerRow, toLearnerProgress, toLearnerRow } from "../../mappers";

const LearnerProgress = ({
  spoilId,
  learner,
  simplified,
  onBack,
}: {
  spoilId: number;
  learner: LearnerRow;
  simplified: boolean;
  onBack: () => void;
}) => {
  const { progress, isLoading, isError, errorMessage } = useGetLearnerSpoilProgressQuery(spoilId, learner.learnerId);

  if (progress) {
    return (
      <StudentProgress
        student={toLearnerProgress(learner, progress)}
        onBack={onBack}
        onViewProfile={() => toast("Learner profile page coming soon")}
        simplified={simplified}
      />
    );
  }

  return (
    <div>
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
      <p className="mt-4 text-gray-500">{learner.name}</p>
      <h2 className="mt-1 text-xl font-semibold text-[#212529]">Progress Details</h2>
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

const EnrolledStudentsTab = ({ spoilId, simplified = false }: { spoilId: number; simplified?: boolean }) => {
  const [selectedLearner, setSelectedLearner] = useState<LearnerRow | null>(null);
  const { learners, isLoading, isError, errorMessage } = useGetSpoilLearnersQuery(spoilId);

  if (selectedLearner) {
    return (
      <LearnerProgress
        spoilId={spoilId}
        learner={selectedLearner}
        simplified={simplified}
        onBack={() => setSelectedLearner(null)}
      />
    );
  }

  return (
    <EnrolledStudentsTable
      students={learners.map(toLearnerRow)}
      isLoading={isLoading}
      errorMessage={isError ? errorMessage : null}
      onViewMore={setSelectedLearner}
    />
  );
};

export default EnrolledStudentsTab;
