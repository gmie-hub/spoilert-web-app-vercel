"use client";

import { useState } from "react";

import { FilterBar, Pagination } from "@spt/components";

import Badge from "../../lecturers/details/components/spoylz/Badge";

import type { RevenueTransaction } from "./constants";

const Avatar = () => (
  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="#9CA3AF" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#9CA3AF" />
    </svg>
  </span>
);

const TransactionHistoryTable = ({
  transactions,
  onViewMore,
}: {
  transactions: RevenueTransaction[];
  onViewMore: (transaction: RevenueTransaction) => void;
}) => {
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState(1);

  const query = search.trim().toLowerCase();
  const filtered = transactions.filter(
    (transaction) =>
      transaction.studentName.toLowerCase().includes(query) ||
      transaction.lecturerName.toLowerCase().includes(query) ||
      transaction.spoylzTitle.toLowerCase().includes(query) ||
      transaction.transactionId.toLowerCase().includes(query),
  );

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-[#212529]">Transaction History</h2>

      <FilterBar
        searchPlaceholder="Search name, transaction ID..."
        filters={[{ label: "Status" }, { label: "Date", type: "date" }]}
        search={search}
        onSearchChange={setSearch}
        onReset={() => setSearch("")}
      />

      <div className="overflow-x-auto">
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
            {filtered.map((transaction, index) => (
              <tr key={transaction.id} className="border-b border-gray-50">
                <td className="py-4 pr-4 text-gray-500">{index + 1}</td>
                <td className="py-4 pr-4 text-gray-500">{transaction.transactionId}</td>
                <td className="py-4 pr-4 text-[#212529]">{transaction.studentName}</td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-9 w-9 shrink-0 rounded-lg"
                      style={{ backgroundColor: transaction.thumbnailColor }}
                    />
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
                  <Badge label={transaction.status} />
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
            ))}
          </tbody>
        </table>
      </div>

      <Pagination activePage={activePage} onPageChange={setActivePage} />
    </div>
  );
};

export default TransactionHistoryTable;
