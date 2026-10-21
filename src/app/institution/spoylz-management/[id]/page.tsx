"use client";

import { use } from "react";

import SpoylzManagementDetails from "@spt/screens/institution/spoylz-management/details";

const SpoylzManagementDetailsPage = ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; learner?: string }>;
}) => {
  const { id } = use(params);
  const { tab, learner } = use(searchParams);
  return <SpoylzManagementDetails id={id} initialTab={tab} returningLearnerId={learner} />;
};

export default SpoylzManagementDetailsPage;
