"use client";

import { type ElementType, type ReactNode, useState } from "react";

import { FiChevronRight, FiX } from "react-icons/fi";
import { GoArrowUpRight } from "react-icons/go";
import { IoCopyOutline } from "react-icons/io5";
import { LuArrowDownLeft, LuTriangleAlert } from "react-icons/lu";

import useGetPaymentsQuery from "@spt/hooks/apiRequests/useGetPaymentsQuery";
import type { PaymentDatum } from "@spt/hooks/apiRequests/useGetPaymentsQuery";

import { LoadingState } from "../../spoil/preSpoilQuiz/components/LoadingState";

type TransactionType = "withdrawal" | "purchase" | "failed";
type TransactionStatus = "successful" | "pending" | "failed";

interface Transaction {
  id: string;
  type: TransactionType;
  label: string;
  description: string;
  amount: string;
  date: string;
  transactionId: string;
  dateTime: string;
  fullDescription: string;
  rawAmount: string;
  accountCredited: string;
  status: TransactionStatus;
  rejectionReason?: string;
  transactionType?: string;
  learnerName?: string;
}

const ACCOUNT = "2102925627 (Access Bank)- Ogunsola Omorinsola";

const dummyTransactions: Transaction[] = [
  { id: "1", type: "withdrawal", label: "Withdrawal", description: "Description", amount: "-₦15,000.00", date: "12/01/2025", transactionId: "ID-12345677900", dateTime: "Nov 20, 2023 | 8:00pm", fullDescription: "You made a withdrawal", rawAmount: "₦18,375.00", accountCredited: ACCOUNT, status: "successful" },
  { id: "2", type: "withdrawal", label: "Withdrawal", description: "Description", amount: "-₦15,000.00", date: "12/01/2025", transactionId: "ID-12345677901", dateTime: "Nov 21, 2023 | 10:00am", fullDescription: "You made a withdrawal", rawAmount: "₦15,000.00", accountCredited: ACCOUNT, status: "successful" },
  { id: "3", type: "purchase", label: "Spoil Purchase", description: "Description", amount: "+₦15,000.00", date: "12/01/2025", transactionId: "ID-12345677902", dateTime: "Nov 22, 2023 | 2:00pm", fullDescription: "You purchased a Spoil", rawAmount: "₦15,000.00", accountCredited: ACCOUNT, status: "successful" },
  { id: "4", type: "purchase", label: "Spoil Purchase", description: "Description", amount: "+₦15,000.00", date: "12/01/2025", transactionId: "ID-12345677903", dateTime: "Nov 23, 2023 | 4:00pm", fullDescription: "You purchased a Spoil", rawAmount: "₦15,000.00", accountCredited: ACCOUNT, status: "successful" },
  { id: "5", type: "failed", label: "Withdrawal", description: "Description", amount: "-₦15,000.00", date: "12/01/2025", transactionId: "ID-12345677904", dateTime: "Nov 24, 2023 | 9:00am", fullDescription: "Basic Design Principles Spoil", rawAmount: "₦15,000.00", accountCredited: ACCOUNT, status: "failed", rejectionReason: "Your withdrawal was rejected due to security reasons. Please contact support to resolve this.", transactionType: "Spoil Purchase", learnerName: "Ogunsola Omorinsola" },
  { id: "6", type: "withdrawal", label: "Withdrawal", description: "Description", amount: "-₦15,000.00", date: "12/01/2025", transactionId: "ID-12345677905", dateTime: "Nov 25, 2023 | 11:00am", fullDescription: "You made a withdrawal", rawAmount: "₦15,000.00", accountCredited: ACCOUNT, status: "successful" },
  { id: "7", type: "failed", label: "Withdrawal", description: "Description", amount: "-₦15,000.00", date: "12/01/2025", transactionId: "ID-12345677906", dateTime: "Nov 26, 2023 | 3:00pm", fullDescription: "Basic Design Principles Spoil", rawAmount: "₦15,000.00", accountCredited: ACCOUNT, status: "failed", rejectionReason: "Your withdrawal was rejected due to security reasons. Please contact support to resolve this.", transactionType: "Spoil Purchase", learnerName: "Ogunsola Omorinsola" },
  { id: "8", type: "purchase", label: "Spoil Purchase", description: "Description", amount: "+₦15,000.00", date: "12/01/2025", transactionId: "ID-12345677907", dateTime: "Nov 27, 2023 | 1:00pm", fullDescription: "You purchased a Spoil", rawAmount: "₦15,000.00", accountCredited: ACCOUNT, status: "successful" },
  { id: "9", type: "withdrawal", label: "Withdrawal", description: "Description", amount: "-₦15,000.00", date: "12/01/2025", transactionId: "ID-12345677908", dateTime: "Nov 28, 2023 | 6:00pm", fullDescription: "You made a withdrawal", rawAmount: "₦15,000.00", accountCredited: ACCOUNT, status: "pending" },
  { id: "10", type: "withdrawal", label: "Withdrawal", description: "Description", amount: "-₦15,000.00", date: "12/01/2025", transactionId: "ID-12345677909", dateTime: "Nov 29, 2023 | 7:00pm", fullDescription: "You made a withdrawal", rawAmount: "₦15,000.00", accountCredited: ACCOUNT, status: "successful" },
];

const iconConfig: Record<
  TransactionType,
  { bg: string; iconColor: string; Icon: ElementType }
> = {
  withdrawal: {
    bg: "bg-[#FEF0E7]",
    iconColor: "text-[#F97316]",
    Icon: GoArrowUpRight,
  },
  purchase: {
    bg: "bg-[#ECFDF5]",
    iconColor: "text-[#10B981]",
    Icon: LuArrowDownLeft,
  },
  failed: {
    bg: "bg-[#FEF2F2]",
    iconColor: "text-[#EF4444]",
    Icon: LuTriangleAlert,
  },
};

const statusConfig: Record<
  TransactionStatus,
  { label: string; textColor: string; bgColor: string }
> = {
  successful: {
    label: "SUCCESSFUL",
    textColor: "text-[#10B981]",
    bgColor: "bg-[#ECFDF5]",
  },
  pending: {
    label: "PENDING",
    textColor: "text-[#F59E0B]",
    bgColor: "bg-[#FFFBEB]",
  },
  failed: {
    label: "FAILED",
    textColor: "text-[#EF4444]",
    bgColor: "bg-[#FEF2F2]",
  },
};

function TransactionRow({
  tx,
  onClick,
}: {
  tx: Transaction;
  onClick: (tx: Transaction) => void;
}) {
  const { bg, iconColor, Icon } = iconConfig[tx.type];
  const isCredit = tx.type === "purchase";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(tx)}
      onKeyDown={(e) => e.key === "Enter" && onClick(tx)}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-4 transition-colors hover:bg-[#FAFCFE] sm:gap-4"
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${bg}`}
      >
        <Icon className={`h-[18px] w-[18px] ${iconColor}`} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[14px] font-semibold text-[#20262D]">
          {tx.label}
        </span>
        <span className="text-[12px] text-[#9CA3AF]">{tx.description}</span>
      </div>

      <div className="flex flex-col items-end gap-0.5">
        <span
          className={`text-[14px] font-semibold ${isCredit ? "text-[#10B981]" : "text-[#20262D]"}`}
        >
          {tx.amount}
        </span>
        <span className="text-[11px] text-[#9CA3AF]">{tx.date}</span>
      </div>

      <FiChevronRight className="h-[18px] w-[18px] flex-shrink-0 text-[#C5D0D8]" />
    </div>
  );
}

function DetailRow({
  label,
  value,
  isLast,
}: {
  label: string;
  value: ReactNode;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 py-4 ${!isLast ? "border-b border-[#EEF3F6]" : ""}`}
    >
      <span className="flex-shrink-0 text-[13px] text-[#9CA3AF]">{label}</span>
      <span className="text-right text-[13px] font-medium text-[#20262D]">
        {value}
      </span>
    </div>
  );
}

function TransactionModal({
  tx,
  onClose,
}: {
  tx: Transaction;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const status = statusConfig[tx.status];

  function handleCopy() {
    navigator.clipboard.writeText(tx.transactionId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const isRejected = tx.status === "failed";
  const isPurchase = tx.type === "purchase" || isRejected;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px] rounded-2xl bg-white shadow-[0_24px_64px_rgba(11,83,104,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#EEF3F6] px-6 py-5">
          <h3 className="text-[17px] font-semibold text-[#20262D]">
            Transaction Details
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7B8D] transition-colors hover:bg-[#EEF3F6]"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5">
          <div className="rounded-xl border border-[#EEF3F6] px-4">
            {/* Transaction ID + Copy */}
            <div className="border-b border-[#EEF3F6] py-4">
              <span className="text-[13px] text-[#9CA3AF]">
                Transaction ID:{" "}
                <span className="font-semibold text-[#20262D]">
                  {tx.transactionId}
                </span>
              </span>
              <button
                onClick={handleCopy}
                className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#0B5368]/30 px-3 py-1.5 text-[12px] font-medium text-[#0B5368] transition-colors hover:bg-[#EEF3F6]"
              >
                <IoCopyOutline className="h-[14px] w-[14px]" />
                {copied ? "Copied!" : "Copy"}
              </button>

              {/* Rejection reason banner */}
              {isRejected && tx.rejectionReason && (
                <div className="mt-3 rounded-xl bg-[#EBF6FA] px-4 py-3">
                  <p className="mb-1 text-[12px] font-semibold text-[#20262D]">
                    Reason For Rejection
                  </p>
                  <p className="text-[12px] leading-relaxed text-[#4B6070]">
                    {tx.rejectionReason}
                  </p>
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

            {/* Status */}
            <div className="py-4">
              <span className="mb-2 block text-[13px] text-[#9CA3AF]">Status</span>
              <span
                className={`inline-block rounded-md px-3 py-1 text-[12px] font-semibold tracking-wide ${status.textColor} ${status.bgColor}`}
              >
                {isRejected ? "REJECTED" : status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Support button for rejected */}
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

function mapPaymentToTransaction(p: PaymentDatum): Transaction {
  const dateObj = new Date(p.created_at);
  const date = `${String(dateObj.getDate()).padStart(2, "0")}/${String(dateObj.getMonth() + 1).padStart(2, "0")}/${dateObj.getFullYear()}`;
  const dateTime = dateObj.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const num = parseFloat(p.amount);
  const formatted = `₦${num.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
  const signed = p.type === "purchase" ? `+${formatted}` : `-${formatted}`;

  return {
    id: String(p.id),
    type: p.type,
    label: p.type === "purchase" ? "Spoil Purchase" : "Withdrawal",
    description: p.description ?? "Description",
    amount: signed,
    date,
    transactionId: p.reference,
    dateTime,
    fullDescription: p.description ?? "",
    rawAmount: formatted,
    accountCredited: p.account_credited ?? "",
    status: p.status,
    rejectionReason: p.rejection_reason ?? undefined,
    transactionType: p.transaction_type ?? undefined,
    learnerName: p.learner_name ?? undefined,
  };
}

export default function TransactionHistoryPage() {
  const [selected, setSelected] = useState<Transaction | null>(null);
  const { payments, isLoading } = useGetPaymentsQuery();

  if (isLoading) return <LoadingState />;

  const mapped = payments.map(mapPaymentToTransaction);
  const transactions = mapped.length > 0 ? mapped : dummyTransactions;

  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-[20px] font-semibold text-[#20262D]">
          Transaction History
        </h2>

        <div className="mt-2 divide-y divide-[#EEF3F6]">
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} onClick={setSelected} />
          ))}
        </div>
      </div>

      {selected && (
        <TransactionModal tx={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
