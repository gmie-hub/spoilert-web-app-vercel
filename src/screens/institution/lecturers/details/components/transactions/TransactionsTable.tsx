"use client";

import { useState } from "react";

import { FilterBar, Pagination } from "@spt/components";

import Badge from "../spoylz/Badge";

import type { Transaction } from "./constants";

const TransactionsTable = ({
  transactions,
  onViewMore,
}: {
  transactions: Transaction[];
  onViewMore: (transaction: Transaction) => void;
}) => {
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState(1);

  const query = search.trim().toLowerCase();
  const filtered = transactions.filter(
    (transaction) =>
      transaction.transactionType.toLowerCase().includes(query) ||
      transaction.transactionId.toLowerCase().includes(query),
  );

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
      <FilterBar
        searchPlaceholder="Search transactions..."
        filters={[{ label: "Transaction Type" }, { label: "Status" }, { label: "Date Range", type: "date" }]}
        search={search}
        onSearchChange={setSearch}
        onReset={() => setSearch("")}
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400">
              <th className="py-3 pr-4 font-medium">S/N</th>
              <th className="py-3 pr-4 font-medium">Transaction Type</th>
              <th className="py-3 pr-4 font-medium">Transaction ID</th>
              <th className="py-3 pr-4 font-medium">Amount</th>
              <th className="py-3 pr-4 font-medium">Date & Time</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((transaction, index) => (
              <tr key={transaction.id} className="border-b border-gray-50">
                <td className="py-4 pr-4 text-gray-500">{index + 1}</td>
                <td className="py-4 pr-4 text-[#212529]">{transaction.transactionType}</td>
                <td className="py-4 pr-4 text-gray-500">{transaction.transactionId}</td>
                <td className="py-4 pr-4 text-[#212529]">{transaction.amount}</td>
                <td className="py-4 pr-4 text-gray-500">
                  {transaction.date} | {transaction.time}
                </td>
                <td className="py-4 pr-4">
                  <Badge label={transaction.status} />
                </td>
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

export default TransactionsTable;
