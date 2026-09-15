"use client";

import { use } from "react";

import SpoylzManagementDetails from "@spt/screens/institution/spoylz-management/details";

const SpoylzManagementDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  return <SpoylzManagementDetails id={id} />;
};

export default SpoylzManagementDetailsPage;
