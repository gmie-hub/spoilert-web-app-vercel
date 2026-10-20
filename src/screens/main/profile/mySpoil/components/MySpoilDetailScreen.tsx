"use client";

import { useRouter } from "next/navigation";

import MySpoilDetailView from "./MySpoilDetailView";

interface Props {
  spoilId: number;
}

// One of the tutor's Spoylz on its own page (/profile/my-spoils/{id}).
export default function MySpoilDetailScreen({ spoilId }: Props) {
  const router = useRouter();

  // Back to wherever the tutor came from (My Spoylz, the performance charts…),
  // or to My Spoylz when the page was opened directly.
  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/profile/my-spoils");
    }
  };

  return <MySpoilDetailView spoilId={spoilId} onBack={goBack} />;
}
