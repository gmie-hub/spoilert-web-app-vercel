"use client";

import SpoylzManagementTable from "./components/SpoylzManagementTable";
import { MOCK_SPOYLZ_MANAGEMENT } from "./constants";

const SpoylzManagement = () => (
  <div className="w-full space-y-4">
    <h1 className="text-2xl font-semibold text-[#212529]">Spoylz Management</h1>
    <SpoylzManagementTable items={MOCK_SPOYLZ_MANAGEMENT} />
  </div>
);

export default SpoylzManagement;
