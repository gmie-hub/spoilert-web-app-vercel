"use client";

import dynamic from "next/dynamic";

const ManageBankAccount = dynamic(() => import("../components/ManageBankAccount"), { ssr: false });

export default function ManageBankAccountPage() {
  return <ManageBankAccount />;
}
