"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import useGetSpoilLearnersQuery from "@spt/hooks/apiRequests/useGetSpoilLearnersQuery";

import EnrolledStudentsTable from "../../../lecturers/details/components/spoylz/EnrolledStudentsTable";
import { type LearnerRow, toLearnerRow } from "../../mappers";

import LearnerProgress from "./LearnerProgress";

const EnrolledStudentsTab = ({
  spoilId,
  simplified = false,
  returningLearnerId,
}: {
  spoilId: number;
  simplified?: boolean;
  // Set when coming back from a learner's profile, to reopen their progress.
  returningLearnerId?: string;
}) => {
  const router = useRouter();
  const [selectedLearner, setSelectedLearner] = useState<LearnerRow | null>(null);
  const [reopenLearnerId, setReopenLearnerId] = useState(returningLearnerId);
  const { learners, isLoading, isError, errorMessage } = useGetSpoilLearnersQuery(spoilId);
  const rows = learners.map(toLearnerRow);

  const openLearner =
    selectedLearner ?? rows.find((row) => String(row.learnerId) === reopenLearnerId) ?? null;

  if (openLearner) {
    return (
      <LearnerProgress
        spoilId={spoilId}
        learner={openLearner}
        simplified={simplified}
        onBack={() => {
          setSelectedLearner(null);
          setReopenLearnerId(undefined);
        }}
        onViewProfile={() =>
          router.push(`/institution/spoylz-management/${spoilId}/learners/${openLearner.learnerId}`)
        }
      />
    );
  }

  return (
    <EnrolledStudentsTable
      students={rows}
      isLoading={isLoading}
      errorMessage={isError ? errorMessage : null}
      onViewMore={setSelectedLearner}
    />
  );
};

export default EnrolledStudentsTab;
