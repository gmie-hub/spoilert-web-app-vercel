"use client";

import { use } from "react";

import InstitutionSignup from "@spt/screens/institution/signup";

const InstitutionSignupEditPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  return <InstitutionSignup id={id} />;
};

export default InstitutionSignupEditPage;
