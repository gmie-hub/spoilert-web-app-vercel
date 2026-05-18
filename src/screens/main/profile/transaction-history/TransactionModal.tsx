"use client";

import { type ReactNode, useState } from "react";

import { FiX } from "react-icons/fi";
import { IoCopyOutline } from "react-icons/io5";

import { statusConfig } from "./types";
import type { Transaction } from "./types";

function DetailRow({ label, value, isLast }: { label: string; value: ReactNode; isLast?: boolean }) {
  return (
    <div className={`flex items-start justify-between gap-4 py-4 ${!isLast ? "border-b border-[#EEF3F6]" : ""}`}>
      <span className="flex-shrink-0 text-[13px] text-[#9CA3AF]">{label}</span>
      <span className="text-right text-[13px] font-medium text-[#20262D]">{value}</span>
    </div>
  );
}

export function TransactionModal({ tx, onClose }: { tx: Transaction; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const status = statusConfig[tx.status];
  const isRejected = tx.status === "failed";
  const isPurchase = tx.type === "purchase" || isRejected;

  function handleCopy() {
    navigator.clipboard.writeText(tx.transactionId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="w-full max-w-[520px] rounded-2xl bg-white shadow-[0_24px_64px_rgba(11,83,104,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#EEF3F6] px-6 py-5">
          <h3 className="text-[17px] font-semibold text-[#20262D]">Transaction Details</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7B8D] transition-colors hover:bg-[#EEF3F6]"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-xl border border-[#EEF3F6] px-4">
            <div className="border-b border-[#EEF3F6] py-4">
              <span className="text-[13px] text-[#9CA3AF]">
                Transaction ID:{" "}
                <span className="font-semibold text-[#20262D]">{tx.transactionId}</span>
              </span>
              <button
                onClick={handleCopy}
                className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#0B5368]/30 px-3 py-1.5 text-[12px] font-medium text-[#0B5368] transition-colors hover:bg-[#EEF3F6]"
              >
                <IoCopyOutline className="h-[14px] w-[14px]" />
                {copied ? "Copied!" : "Copy"}
              </button>
              {isRejected && tx.rejectionReason && (
                <div className="mt-3 rounded-xl bg-[#EBF6FA] px-4 py-3">
                  <p className="mb-1 text-[12px] font-semibold text-[#20262D]">Reason For Rejection</p>
                  <p className="text-[12px] leading-relaxed text-[#4B6070]">{tx.rejectionReason}</p>
                </div>
              )}
            </div>

            <DetailRow label="Date & Time" value={tx.dateTime} />
            {isPurchase && tx.transactionType && (
              <DetailRow label="Transaction Type" value={tx.transactionType} />
            )}
            <DetailRow label="Description" value={tx.fullDescription} />
            {isPurchase && tx.learnerName ? (
              <DetailRow label="Name of Learner" value={tx.learnerName} />
            ) : (
              <DetailRow label="Account Credited" value={tx.accountCredited} />
            )}
            <DetailRow label="Amount" value={tx.rawAmount} />

            <div className="py-4">
              <span className="mb-2 block text-[13px] text-[#9CA3AF]">Status</span>
              <span className={`inline-block rounded-md px-3 py-1 text-[12px] font-semibold tracking-wide ${status.textColor} ${status.bgColor}`}>
                {isRejected ? "REJECTED" : status.label}
              </span>
            </div>
          </div>
        </div>

        {isRejected && (
          <div className="px-6 pb-6">
            <button className="w-full rounded-xl bg-[#0B5368] py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#0a4a5c]">
              Contact Support
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
