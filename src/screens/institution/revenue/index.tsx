"use client";

import { useState } from "react";

import { StatCard } from "@spt/components";
import useGetPaymentsQuery from "@spt/hooks/apiRequests/useGetPaymentsQuery";
import useInstitutionId from "@spt/hooks/useInstitutionId";

import RevenueSplitCard from "../components/RevenueSplitCard";
import { RevenueIcon } from "../dashboard/components/icons";

import { REVENUE_STATS, type RevenueTransaction } from "./components/constants";
import { TransactionsIcon } from "./components/icons";
import TransactionDetailsModal from "./components/TransactionDetailsModal";
import TransactionHistoryTable from "./components/TransactionHistoryTable";
import { toRevenueTransaction } from "./mappers";

const TRANSACTIONS_PER_PAGE = 15;

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
  const [page, setPage] = useState(1);

  const { institutionId, isResolved } = useInstitutionId();

  // GET /payments?page=&per_page=&institution_id= — no user filter; the
  // institution's id scopes the list, and is left out if it can't be found.
  const { payments, pagination, isLoading, isError, errorMessage } = useGetPaymentsQuery({
    withoutUserFilter: true,
    institution_id: institutionId,
    // Waits for the institution's id so the list isn't fetched twice.
    enabled: isResolved,
    page,
    per_page: TRANSACTIONS_PER_PAGE,
  });

  return (
    <div className="w-full space-y-4">
      <h1 className="text-2xl font-semibold text-[#212529]">Revenue</h1>

      <RevenueSplitCard
        lecturerPercent={REVENUE_STATS.lecturerSplitPercent}
        institutionPercent={REVENUE_STATS.institutionSplitPercent}
      />

      {/* auto-rows-fr keeps every card the same height even when a long label wraps. */}
      <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <TransactionHistoryTable
        transactions={payments.map(toRevenueTransaction)}
        // Still loading while the institution's id is being looked up.
        isLoading={isLoading || !isResolved}
        errorMessage={isError ? errorMessage : null}
        page={page}
        // Keeps the current page listed while the next one loads.
        totalPages={Math.max(page, pagination.last_page)}
        firstRowNumber={(page - 1) * (pagination.per_page ?? TRANSACTIONS_PER_PAGE) + 1}
        onPageChange={setPage}
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
