"use client";

import { useRouter } from "next/navigation";

import EnrolledLearnersView from "./EnrolledLearnersView";

interface Props {
  spoilId: number;
}

export default function EnrolledLearnersScreen({ spoilId }: Props) {
  const router = useRouter();

  return (
    <EnrolledLearnersView
      spoilId={spoilId}
      onBack={() => router.back()}
      onSelectLearner={(learner) =>
        router.push(`/my-spoils/${spoilId}/enrolled-learners/${learner.id}`)
      }
    />
  );
}
