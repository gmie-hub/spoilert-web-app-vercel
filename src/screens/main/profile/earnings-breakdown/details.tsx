"use client";

import { useState } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiChevronLeft } from "react-icons/fi";

import useGetPaymentsQuery from "@spt/hooks/apiRequests/useGetPaymentsQuery";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";

import { Pagination } from "../transaction-history/Pagination";
import { TransactionModal } from "../transaction-history/TransactionModal";
import { TransactionRow } from "../transaction-history/TransactionRow";
import { mapPaymentToTransaction } from "../transaction-history/types";

import type { Transaction } from "../transaction-history/types";

const PER_PAGE = 15;

const dateInputClass =
  "rounded-lg border border-[#E9EEF2] bg-white px-2 py-2 text-sm font-medium text-[#20262D] focus:outline-none";

// The payments behind one Spoylz's earnings (GET /payments?spoil_id=…),
// optionally narrowed to a date range (from_date / to_date).
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
      roleOverride: "tutor",
    });

  const hasDateRange = Boolean(fromDate || toDate);

  // A new date range starts again from its first page.
  const changeDates = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    setPage(1);
  };

  return (
    <>
      <div>
        <h2 className="text-[18px] font-semibold text-[#212529]">
          Spoylz Earnings
        </h2>
        <p className="mt-1 text-[16px] text-[#495057]">
          {spoil?.title
            ? `Payments for ${spoil.title}`
            : "Payments for this Spoylz"}
        </p>
      </div>

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

      <div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0B5368] border-t-transparent" />
          </div>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-red-500">{errorMessage}</p>
        ) : payments.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            {hasDateRange
              ? "No payments for this Spoylz between these dates."
              : "No payments for this Spoylz yet."}
          </p>
        ) : (
          <div className="divide-y divide-[#EEF3F6]">
            {payments.map(mapPaymentToTransaction).map((tx) => (
              <TransactionRow key={tx.id} tx={tx} onClick={setSelected} />
            ))}
          </div>
        )}

        <Pagination
          current={pagination.current_page}
          total={pagination.last_page}
          onChange={setPage}
        />
      </div>

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
        Back
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
