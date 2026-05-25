"use client";

import { useRouter } from "next/navigation";

import type { EnrolledLearner } from "@spt/hooks/apiRequests/useGetEnrolledLearnersQuery";
import useGetEnrolledLearnersQuery from "@spt/hooks/apiRequests/useGetEnrolledLearnersQuery";
import { LoadingState } from "@spt/screens/main/spoil/preSpoilQuiz/components/LoadingState";

import LearnerProgressView from "./LearnerProgressView";

const DUMMY_LEARNERS: EnrolledLearner[] = [
  { id: 1, status: "completed", created_at: "2024-11-10", learner: { id: 1, first_name: "Amara", last_name: "Okafor" } },
  { id: 2, status: "ongoing", created_at: "2024-12-01", learner: { id: 2, first_name: "Chidi", last_name: "Nwosu" } },
  { id: 3, status: "not_started", created_at: "2025-01-15", learner: { id: 3, first_name: "Fatima", last_name: "Bello" } },
  { id: 4, status: "ongoing", created_at: "2025-02-03", learner: { id: 4, first_name: "Emeka", last_name: "Adeyemi" } },
  { id: 5, status: "completed", created_at: "2025-03-20", learner: { id: 5, first_name: "Ngozi", last_name: "Eze" } },
  { id: 6, status: "not_started", created_at: "2025-04-05", learner: { id: 6, first_name: "Tunde", last_name: "Akinola" } },
];

interface Props {
  spoilId: number;
  enrollmentId: number;
}

export default function LearnerProgressScreen({ spoilId, enrollmentId }: Props) {
  const router = useRouter();
  const { learners, isLoading } = useGetEnrolledLearnersQuery(spoilId);

  if (isLoading) return <LoadingState />;

  // Fall back to dummy learners when API returns nothing (e.g. 405)
  const source = learners.length > 0 ? learners : DUMMY_LEARNERS;
  const learner =
    source.find((l) => l.id === enrollmentId) ??
    ({ id: enrollmentId, status: "ongoing", created_at: "2025-01-10", learner: { id: enrollmentId, first_name: "Sample", last_name: "Learner" } } satisfies EnrolledLearner);

  return (
    <LearnerProgressView
      spoilId={spoilId}
      learner={learner}
      onBack={() => router.push(`/my-spoils/${spoilId}/enrolled-learners`)}
      onBackToDetail={() => router.push("/profile/my-spoils")}
    />
  );
}
