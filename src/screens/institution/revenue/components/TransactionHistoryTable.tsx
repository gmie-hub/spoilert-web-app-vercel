"use client";

import { useState } from "react";

import { FilterBar, Pagination } from "@spt/components";

import TableStatusRow from "../../lecturers/components/TableStatusRow";
import Badge from "../../lecturers/details/components/spoylz/Badge";
import SpoylzThumbnail from "../../lecturers/details/components/spoylz/SpoylzThumbnail";

import type { RevenueTransaction } from "./constants";

const Avatar = () => (
  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="#9CA3AF" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#9CA3AF" />
    </svg>
  </span>
);

const StatusBadge = ({ status }: { status: string | null }) =>
  status ? <Badge label={status} /> : <span className="text-gray-400">-</span>;

const MobileField = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <dt className="text-xs text-gray-400">{label}</dt>
    <dd className="mt-0.5 truncate text-[#212529]">{value}</dd>
  </div>
);

// The API pages the transactions, so this shows one page at a time and its
// search only covers that page.
const TransactionHistoryTable = ({
  transactions,
  isLoading,
  errorMessage,
  page,
  totalPages,
  firstRowNumber,
  onPageChange,
  onViewMore,
}: {
  transactions: RevenueTransaction[];
  isLoading: boolean;
  errorMessage: string | null;
  page: number;
  totalPages: number;
  firstRowNumber: number;
  onPageChange: (page: number) => void;
  onViewMore: (transaction: RevenueTransaction) => void;
}) => {
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const filtered = transactions.filter(
    (transaction) =>
      transaction.studentName.toLowerCase().includes(query) ||
      transaction.lecturerName.toLowerCase().includes(query) ||
      transaction.spoylzTitle.toLowerCase().includes(query) ||
      transaction.transactionId.toLowerCase().includes(query),
  );
  const showStatus = isLoading || Boolean(errorMessage) || filtered.length === 0;
  const emptyMessage = query ? "No transactions match your search." : "No transactions yet.";

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 lg:p-8">
      <h2 className="text-lg font-semibold text-[#212529]">Transaction History</h2>

      <FilterBar
        searchPlaceholder="Search name, transaction ID..."
        filters={[{ label: "Status" }, { label: "Date", type: "date" }]}
        search={search}
        onSearchChange={setSearch}
        onReset={() => setSearch("")}
      />

      {/* Phones and tablets: one card per transaction instead of the wide table. */}
      <div className="lg:hidden">
        {showStatus ? (
          <div className="py-12 text-center text-sm">
            {isLoading ? (
              <span className="mx-auto block h-4 w-48 animate-pulse rounded bg-gray-100" />
            ) : errorMessage ? (
              <span className="text-red-600">{errorMessage}</span>
            ) : (
              <span className="text-gray-400">{emptyMessage}</span>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((transaction) => (
              <li
                key={transaction.id}
                className="flex h-full flex-col gap-4 rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-start gap-3">
                  <SpoylzThumbnail src={transaction.thumbnail} alt={transaction.spoylzTitle} />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 min-h-[2lh] text-sm font-medium text-[#212529]">
                      {transaction.spoylzTitle}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-400">{transaction.transactionId}</p>
                  </div>
                  <span className="shrink-0 text-sm">
                    <StatusBadge status={transaction.status} />
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <MobileField label="Student" value={transaction.studentName} />
                  <MobileField label="Lecturer" value={transaction.lecturerName} />
                  <MobileField label="Spoylz Amount" value={transaction.spoylzAmount} />
                  <MobileField label="Date" value={transaction.date} />
                  <MobileField label="Lecturer’s Share" value={transaction.lecturerShare} />
                  <MobileField label="Institution’s Share" value={transaction.institutionShare} />
                </dl>

                <button
                  type="button"
                  onClick={() => onViewMore(transaction)}
                  className="mt-auto w-full rounded-lg border border-[var(--color-blue)] px-4 py-2 text-sm font-medium text-[var(--color-blue)]"
                >
                  View More
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1200px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400">
              <th className="py-3 pr-4 font-medium">S/N</th>
              <th className="py-3 pr-4 font-medium">Transaction ID</th>
              <th className="py-3 pr-4 font-medium">Name of Student</th>
              <th className="py-3 pr-4 font-medium">Spoylz Title</th>
              <th className="py-3 pr-4 font-medium">Name of Lecturer</th>
              <th className="py-3 pr-4 font-medium">Spoylz Amount</th>
              <th className="py-3 pr-4 font-medium">Lecturer&rsquo;s Share</th>
              <th className="py-3 pr-4 font-medium">Institution&rsquo;s Share</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Date</th>
              <th className="py-3 pr-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {showStatus ? (
              <TableStatusRow
                colSpan={11}
                isLoading={isLoading}
                errorMessage={errorMessage}
                emptyMessage={emptyMessage}
              />
            ) : (
              filtered.map((transaction, index) => (
                <tr key={transaction.id} className="border-b border-gray-50">
                  <td className="py-4 pr-4 text-gray-500">{firstRowNumber + index}</td>
                  <td className="py-4 pr-4 text-gray-500">{transaction.transactionId}</td>
                  <td className="py-4 pr-4 text-[#212529]">{transaction.studentName}</td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <SpoylzThumbnail src={transaction.thumbnail} alt={transaction.spoylzTitle} />
                      <span className="text-[#212529]">{transaction.spoylzTitle}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar />
                      <span className="text-[#212529]">{transaction.lecturerName}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-[#212529]">{transaction.spoylzAmount}</td>
                  <td className="py-4 pr-4 text-[#212529]">{transaction.lecturerShare}</td>
                  <td className="py-4 pr-4 text-[#212529]">{transaction.institutionShare}</td>
                  <td className="py-4 pr-4">
                    <StatusBadge status={transaction.status} />
                  </td>
                  <td className="py-4 pr-4 text-gray-500">{transaction.date}</td>
                  <td className="py-4 pr-4">
                    <button
                      type="button"
                      onClick={() => onViewMore(transaction)}
                      className="whitespace-nowrap rounded-lg border border-[var(--color-blue)] px-4 py-1.5 text-sm font-medium text-[var(--color-blue)]"
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination activePage={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
};

export default TransactionHistoryTable;
