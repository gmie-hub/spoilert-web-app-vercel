import { type ElementType } from "react";

import { GoArrowUpRight } from "react-icons/go";
import { LuArrowDownLeft, LuTriangleAlert } from "react-icons/lu";

import type { PaymentDatum } from "@spt/hooks/apiRequests/useGetPaymentsQuery";

export type TransactionType = "withdrawal" | "purchase" | "failed";
export type TransactionStatus = "successful" | "pending" | "failed";
export type ViewType = "tutor" | "learner";

export interface Transaction {
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

export const dummyTransactions: Transaction[] = [
  { id: "1", type: "withdrawal", label: "Withdrawal", description: "Description", amount: "-₦15,000.00", date: "12/01/2025", transactionId: "ID-12345677900", dateTime: "Nov 20, 2023 | 8:00pm", fullDescription: "You made a withdrawal", rawAmount: "₦18,375.00", accountCredited: "2102925627 (Access Bank)- Ogunsola Omorinsola", status: "successful" },
  { id: "3", type: "purchase", label: "Spoil Purchase", description: "Description", amount: "+₦15,000.00", date: "12/01/2025", transactionId: "ID-12345677902", dateTime: "Nov 22, 2023 | 2:00pm", fullDescription: "You purchased a Spoil", rawAmount: "₦15,000.00", accountCredited: "2102925627 (Access Bank)- Ogunsola Omorinsola", status: "successful" },
  { id: "5", type: "failed", label: "Withdrawal", description: "Description", amount: "-₦15,000.00", date: "12/01/2025", transactionId: "ID-12345677904", dateTime: "Nov 24, 2023 | 9:00am", fullDescription: "Basic Design Principles Spoil", rawAmount: "₦15,000.00", accountCredited: "2102925627 (Access Bank)- Ogunsola Omorinsola", status: "failed", rejectionReason: "Your withdrawal was rejected due to security reasons. Please contact support to resolve this.", transactionType: "Spoil Purchase", learnerName: "Ogunsola Omorinsola" },
];

export const iconConfig: Record<TransactionType, { bg: string; iconColor: string; Icon: ElementType }> = {
  withdrawal: { bg: "bg-[#FEF0E7]", iconColor: "text-[#F97316]", Icon: GoArrowUpRight },
  purchase: { bg: "bg-[#ECFDF5]", iconColor: "text-[#10B981]", Icon: LuArrowDownLeft },
  failed: { bg: "bg-[#FEF2F2]", iconColor: "text-[#EF4444]", Icon: LuTriangleAlert },
};

export const statusConfig: Record<TransactionStatus, { label: string; textColor: string; bgColor: string }> = {
  successful: { label: "SUCCESSFUL", textColor: "text-[#10B981]", bgColor: "bg-[#ECFDF5]" },
  pending: { label: "PENDING", textColor: "text-[#F59E0B]", bgColor: "bg-[#FFFBEB]" },
  failed: { label: "FAILED", textColor: "text-[#EF4444]", bgColor: "bg-[#FEF2F2]" },
};

const VALID_TYPES = new Set<TransactionType>(["withdrawal", "purchase", "failed"]);
const VALID_STATUSES = new Set<TransactionStatus>(["successful", "pending", "failed"]);

const TYPE_LABEL: Record<string, string> = {
  promotion: "Spoil Promotion",
  sponsored_spoil: "Spoil Sale",
  purchase: "Spoil Purchase",
  withdrawal: "Withdrawal",
  credit: "Spoil Purchase",
  debit: "Withdrawal",
  failed: "Failed",
};

function toTransactionType(raw: string): TransactionType {
  if (VALID_TYPES.has(raw as TransactionType)) return raw as TransactionType;
  if (raw === "credit" || raw === "sponsored_spoil") return "purchase";
  if (raw === "debit" || raw === "promotion") return "withdrawal";
  return "withdrawal";
}

function toTransactionStatus(raw: string): TransactionStatus {
  if (VALID_STATUSES.has(raw as TransactionStatus)) return raw as TransactionStatus;
  return "pending";
}

export function mapPaymentToTransaction(p: PaymentDatum): Transaction {
  const dateObj = new Date(p.created_at);
  const date = `${String(dateObj.getDate()).padStart(2, "0")}/${String(dateObj.getMonth() + 1).padStart(2, "0")}/${dateObj.getFullYear()}`;
  const dateTime = dateObj.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
  const num = parseFloat(p.amount);
  const formatted = `₦${num.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
  const type = toTransactionType(p.type);
  const signed = type === "purchase" ? `+${formatted}` : `-${formatted}`;
  const label = TYPE_LABEL[p.type] ?? (type === "purchase" ? "Spoil Purchase" : "Withdrawal");

  return {
    id: String(p.id),
    type,
    label,
    description: p.description ?? p.type ?? "Description",
    amount: signed,
    date,
    transactionId: p.reference,
    dateTime,
    fullDescription: p.description ?? label,
    rawAmount: formatted,
    accountCredited: p.account_credited ?? "",
    status: toTransactionStatus(p.status),
    rejectionReason: p.rejection_reason ?? undefined,
    transactionType: p.transaction_type ?? p.type ?? undefined,
    learnerName: p.learner_name ?? undefined,
  };
}
