"use client";

import { useEffect, useState } from "react";

import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import useGetPaymentsQuery from "@spt/hooks/apiRequests/useGetPaymentsQuery";

import { TransactionModal } from "./TransactionModal";
import { TransactionRow } from "./TransactionRow";
import { dummyTransactions, mapPaymentToTransaction } from "./types";

import type { Transaction, ViewType } from "./types";

const PER_PAGE = 15;

const VIEW_OPTIONS: { value: ViewType; label: string }[] = [
  { value: "tutor", label: "Tutor Transactions" },
  { value: "learner", label: "Learner Transactions" },
];

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  if (total <= 1) return null;

  const pages: (number | "…")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("…");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("…");
    pages.push(total);
  }

  return (
    <div className="flex items-center justify-center gap-1 py-4 shrink-0">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7B8D] transition-colors hover:bg-[#EEF3F6] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FiChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-[13px] text-[#9CA3AF]">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
              p === current
                ? "bg-[#0B5368] text-white"
                : "text-[#6B7B8D] hover:bg-[#EEF3F6]"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7B8D] transition-colors hover:bg-[#EEF3F6] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FiChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

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
