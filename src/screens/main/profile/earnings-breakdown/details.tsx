"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import useGetPaymentsQuery from "@spt/hooks/apiRequests/useGetPaymentsQuery";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";

import { Pagination } from "../transaction-history/Pagination";
import { TransactionModal } from "../transaction-history/TransactionModal";
import { mapPaymentToTransaction, statusConfig } from "../transaction-history/types";

import type { Transaction } from "../transaction-history/types";

const PER_PAGE = 15;

const dateInputClass =
  "rounded-lg border border-[#E9EEF2] bg-white px-2 py-2 text-sm font-medium text-[#20262D] focus:outline-none";

function PaymentRow({
  tx,
  onSelect,
}: {
  tx: Transaction;
  onSelect: (tx: Transaction) => void;
}) {
  const status = statusConfig[tx.status];

  return (
    <button
      type="button"
      onClick={() => onSelect(tx)}
      className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-[#FAFCFE] focus-visible:bg-[#FAFCFE] focus-visible:outline-none sm:gap-4"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-[#20262D]">
          {tx.learnerName || tx.label}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-[#9CA3AF]">
          {tx.dateTime} · {tx.transactionId}
        </p>
      </div>

      <div className="flex flex-shrink-0 flex-col items-end gap-1">
        <span className="text-[14px] font-semibold text-[#20262D]">{tx.rawAmount}</span>
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide ${status.textColor} ${status.bgColor}`}
        >
          {status.label}
        </span>
      </div>

      <FiChevronRight className="h-[18px] w-[18px] flex-shrink-0 text-[#C5D0D8]" />
    </button>
  );
}

// One Spoylz's payments (GET /payments?spoil_id=…), optionally narrowed to a
// date range (from_date / to_date).
function SpoilEarnings({ spoilId }: { spoilId: number }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const { data: spoil } = useGetSpoilDetailsQuery(spoilId);
  const { payments, pagination, isLoading, isError, errorMessage } =
    useGetPaymentsQuery({
      spoil_id: spoilId,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
      page,
      per_page: PER_PAGE,
    });

  const transactions = payments.map(mapPaymentToTransaction);
  const paymentCount = pagination.total || payments.length;
  const hasDateRange = Boolean(fromDate || toDate);

  // A new date range starts again from its first page.
  const changeDates = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    setPage(1);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-[14px] bg-gray-100">
          {spoil?.cover_image_url && (
            <Image
              src={spoil.cover_image_url}
              alt={spoil.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          )}
        </div>
        <div className="min-w-0">
          <h2 className="text-[18px] font-semibold text-[#212529]">Spoylz Earnings</h2>
          <p className="mt-0.5 line-clamp-2 text-[15px] text-[#495057]">
            {spoil?.title ?? "Payments for this Spoylz"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="text-sm text-[#8A98A3]">From</span>
            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => changeDates(e.target.value, toDate)}
              className={dateInputClass}
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm text-[#8A98A3]">To</span>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => changeDates(fromDate, e.target.value)}
              className={dateInputClass}
            />
          </label>
          {hasDateRange && (
            <button
              type="button"
              onClick={() => changeDates("", "")}
              className="text-sm font-medium text-[#0B5368] hover:opacity-75"
            >
              Clear dates
            </button>
          )}
        </div>

        {!isLoading && !isError && (
          <p className="text-sm text-[#6B7280]">
            {paymentCount} {paymentCount === 1 ? "payment" : "payments"}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#EEF3F6] bg-white">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0B5368] border-t-transparent" />
          </div>
        ) : isError ? (
          <p className="px-4 py-10 text-center text-sm text-red-500">{errorMessage}</p>
        ) : transactions.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-gray-500">
            {hasDateRange
              ? "No payments for this Spoylz between these dates."
              : "No payments for this Spoylz yet."}
          </p>
        ) : (
          <div className="divide-y divide-[#EEF3F6]">
            {transactions.map((tx) => (
              <PaymentRow key={tx.id} tx={tx} onSelect={setSelected} />
            ))}
          </div>
        )}
      </div>

      <Pagination
        current={pagination.current_page}
        total={pagination.last_page}
        onChange={setPage}
      />

      {selected && (
        <TransactionModal tx={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

export default function SpoilEarningsDetailsPage() {
  const searchParams = useSearchParams();
  const spoilId = Number(searchParams.get("spoilId")) || null;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/profile/earnings-breakdown"
        className="flex w-fit items-center gap-1 text-sm font-medium text-[#003049]"
      >
        <FiChevronLeft className="text-base" />
        Back to Earnings Breakdown
      </Link>

      {spoilId ? (
        <SpoilEarnings spoilId={spoilId} />
      ) : (
        <p className="py-8 text-center text-sm text-gray-500">
          This Spoylz couldn&apos;t be found.
        </p>
      )}
    </div>
  );
}
