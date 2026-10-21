"use client";

import { use } from "react";

import LearnerProfile from "@spt/screens/institution/spoylz-management/learner-profile";

const LearnerProfilePage = ({ params }: { params: Promise<{ id: string; learnerId: string }> }) => {
  const { id, learnerId } = use(params);
  return <LearnerProfile spoilId={id} learnerId={learnerId} />;
};

export default LearnerProfilePage;
