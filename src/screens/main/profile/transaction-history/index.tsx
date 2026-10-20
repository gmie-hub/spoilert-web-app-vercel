"use client";

import { useEffect, useState } from "react";

import { FiChevronDown } from "react-icons/fi";

import useGetPaymentsQuery from "@spt/hooks/apiRequests/useGetPaymentsQuery";

import { Pagination } from "./Pagination";
import { TransactionModal } from "./TransactionModal";
import { TransactionRow } from "./TransactionRow";
import { dummyTransactions, mapPaymentToTransaction } from "./types";

import type { Transaction, ViewType } from "./types";

const PER_PAGE = 15;

const VIEW_OPTIONS: { value: ViewType; label: string }[] = [
  { value: "tutor", label: "Tutor Transactions" },
  { value: "learner", label: "Learner Transactions" },
];

export default function TransactionHistoryPage() {
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [viewType, setViewType] = useState<ViewType>("tutor");
  const [page, setPage] = useState(1);

  const { payments, pagination, isLoading } = useGetPaymentsQuery({
    page,
    per_page: PER_PAGE,
    roleOverride: viewType,
  });

  // Reset to page 1 when switching view
  useEffect(() => { setPage(1); }, [viewType]);

  const transactions = payments.length > 0
    ? payments.map(mapPaymentToTransaction)
    : isLoading ? [] : dummyTransactions;

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-160px)]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap pb-3 shrink-0">
          <h2 className="text-[20px] font-semibold text-[#20262D]">Transaction History</h2>

          <div className="relative">
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value as ViewType)}
              className="appearance-none cursor-pointer rounded-xl border border-[#EEF3F6] bg-white py-2 pl-4 pr-9 text-[13px] font-medium text-[#20262D] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0B5368]/30"
            >
              {VIEW_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7B8D]" />
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0B5368] border-t-transparent" />
            </div>
          ) : (
            <div className="divide-y divide-[#EEF3F6]">
              {transactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} onClick={setSelected} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          current={pagination.current_page}
          total={pagination.last_page}
          onChange={(p) => { setPage(p); }}
        />
      </div>

      {selected && (
        <TransactionModal tx={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
