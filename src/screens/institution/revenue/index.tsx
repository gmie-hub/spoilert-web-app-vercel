"use client";

import { useState } from "react";

import { StatCard } from "@spt/components";

import RevenueSplitCard from "../components/RevenueSplitCard";
import { RevenueIcon } from "../dashboard/components/icons";

import { MOCK_REVENUE_TRANSACTIONS, REVENUE_STATS, type RevenueTransaction } from "./components/constants";
import { TransactionsIcon } from "./components/icons";
import TransactionDetailsModal from "./components/TransactionDetailsModal";
import TransactionHistoryTable from "./components/TransactionHistoryTable";

const STATS = [
  {
    label: "Total Transactions",
    value: REVENUE_STATS.totalTransactions,
    icon: <TransactionsIcon color="var(--color-yellow)" />,
    iconBg: "bg-orange-50",
  },
  {
    label: "Total Lecturer Earnings",
    value: REVENUE_STATS.totalLecturerEarnings,
    icon: <RevenueIcon color="#EC4899" />,
    iconBg: "bg-pink-50",
  },
  {
    label: "Total Revenue Generated Overtime",
    value: REVENUE_STATS.totalRevenueOvertime,
    icon: <RevenueIcon color="#6D28D9" />,
    iconBg: "bg-indigo-50",
  },
  {
    label: "Total Revenue Generated Today",
    value: REVENUE_STATS.totalRevenueToday,
    icon: <RevenueIcon color="#DC3545" />,
    iconBg: "bg-red-50",
  },
  {
    label: "Total Revenue Generated This Week",
    value: REVENUE_STATS.totalRevenueThisWeek,
    icon: <RevenueIcon color="#0891B2" />,
    iconBg: "bg-cyan-50",
  },
  {
    label: "Total Revenue Generated This Month",
    value: REVENUE_STATS.totalRevenueThisMonth,
    icon: <RevenueIcon color="#0D9488" />,
    iconBg: "bg-teal-50",
  },
];

const InstitutionRevenue = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<RevenueTransaction | null>(null);

  return (
    <div className="w-full space-y-4">
      <h1 className="text-2xl font-semibold text-[#212529]">Revenue</h1>

      <RevenueSplitCard
        lecturerPercent={REVENUE_STATS.lecturerSplitPercent}
        institutionPercent={REVENUE_STATS.institutionSplitPercent}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <TransactionHistoryTable
        transactions={MOCK_REVENUE_TRANSACTIONS}
        onViewMore={setSelectedTransaction}
      />

      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default InstitutionRevenue;
