"use client";

import dynamic from "next/dynamic";

// Reads the persisted auth store, so render client-side only to avoid a hydration mismatch.
const InstitutionProfile = dynamic(() => import("@spt/screens/institution/profile"), {
  ssr: false,
});

const InstitutionProfilePage = () => {
  return <InstitutionProfile />;
};

export default InstitutionProfilePage;
