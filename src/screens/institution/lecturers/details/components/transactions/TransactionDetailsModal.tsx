"use client";

import { type ReactNode, useState } from "react";

import Badge from "../spoylz/Badge";

import type { Transaction } from "./constants";

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="9" y="9" width="12" height="12" rx="2" stroke="var(--color-blue)" strokeWidth="1.7" />
    <path d="M6 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V6" stroke="var(--color-blue)" strokeWidth="1.7" />
  </svg>
);

const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-4 last:border-0">
    <span className="shrink-0 text-sm text-gray-400">{label}</span>
    <span className="text-right text-sm font-medium text-[#212529]">{value}</span>
  </div>
);

const TransactionDetailsModal = ({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transaction.transactionId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isSpoylzPurchase = transaction.transactionType === "Spoylz Purchase";
  const isWithdrawal = transaction.transactionType === "Withdrawal";
  const isAirtimeOrData = transaction.transactionType === "Airtime" || transaction.transactionType === "Data";

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

          <DetailRow label="Transaction Type" value={transaction.transactionType} />
          <DetailRow label="Date & Time" value={`${transaction.date} | ${transaction.time}`} />
          <DetailRow label="Description" value={transaction.description} />

          {isSpoylzPurchase && (
            <>
              <DetailRow label="Name of Student" value={transaction.studentName} />
              <DetailRow label="Spoylz Title" value={transaction.spoylzTitle} />
              <DetailRow label="Spoylz Cost Fee" value={transaction.spoylzCostFee} />
              <DetailRow label="Administrator Fee" value={transaction.administratorFee} />
              <DetailRow label="Certificate Fee" value={transaction.certificateFee} />
              <DetailRow label="V.A.T (7.5%)" value={transaction.vat} />
              <DetailRow label="Total Amount Paid" value={transaction.totalAmountPaid} />
            </>
          )}

          {isWithdrawal && (
            <>
              <DetailRow label="Account Credited" value={transaction.accountCredited} />
              <DetailRow label="Amount" value={transaction.amount} />
            </>
          )}

          {isAirtimeOrData && (
            <>
              <DetailRow label="Phone Number" value={transaction.phoneNumber} />
              <DetailRow label="Network" value={transaction.network} />
              <DetailRow label="Amount" value={transaction.amount} />
            </>
          )}

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
