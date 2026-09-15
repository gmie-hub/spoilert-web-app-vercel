"use client";

import { type ReactNode, useState } from "react";

import Badge from "../../lecturers/details/components/spoylz/Badge";

import type { RevenueTransaction } from "./constants";

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="9" y="9" width="12" height="12" rx="2" stroke="var(--color-blue)" strokeWidth="1.7" />
    <path d="M6 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V6" stroke="var(--color-blue)" strokeWidth="1.7" />
  </svg>
);

const FieldCell = ({ label, value }: { label: string; value: ReactNode }) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="mt-1 font-medium text-[#212529]">{value}</p>
  </div>
);

const FieldRow = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-2 gap-4 border-b border-gray-100 py-4 last:border-0">{children}</div>
);

const TransactionDetailsModal = ({
  transaction,
  onClose,
}: {
  transaction: RevenueTransaction;
  onClose: () => void;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transaction.transactionId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.15)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold text-[#212529]">Transaction Details</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-gray-100 px-4">
          <div className="border-b border-gray-100 py-4">
            <span className="text-sm text-gray-400">
              Transaction ID: <span className="font-semibold text-[#212529]">{transaction.transactionId}</span>
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-2 flex items-center gap-1.5 rounded-lg border border-[var(--color-blue)] px-3 py-1.5 text-xs font-medium text-[var(--color-blue)]"
            >
              <CopyIcon />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="border-b border-gray-100 py-4">
            <FieldCell label="Spoylz Title" value={transaction.spoylzTitle} />
          </div>

          <FieldRow>
            <FieldCell label="Name of Student" value={transaction.studentName} />
            <FieldCell label="Name of Lecturer" value={transaction.lecturerName} />
          </FieldRow>
          <FieldRow>
            <FieldCell label="Spoylz Amount" value={transaction.spoylzAmount} />
            <FieldCell label="Lecturer's Share" value={transaction.lecturerShare} />
          </FieldRow>
          <FieldRow>
            <FieldCell label="Institution Share" value={transaction.institutionShare} />
            <FieldCell label="Date Purchased" value={transaction.dateTime} />
          </FieldRow>

          <div className="py-4">
            <p className="mb-2 text-sm text-gray-400">Status</p>
            <Badge label={transaction.status} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
