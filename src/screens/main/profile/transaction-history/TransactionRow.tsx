"use client";

import { FiChevronRight } from "react-icons/fi";

import { iconConfig } from "./types";

import type { Transaction } from "./types";

export function TransactionRow({ tx, onClick }: { tx: Transaction; onClick: (tx: Transaction) => void }) {
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
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${bg}`}>
        <Icon className={`h-[18px] w-[18px] ${iconColor}`} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[14px] font-semibold text-[#20262D]">{tx.label}</span>
        <span className="text-[12px] text-[#9CA3AF]">{tx.description}</span>
      </div>

      <div className="flex flex-col items-end gap-0.5">
        <span className={`text-[14px] font-semibold ${isCredit ? "text-[#10B981]" : "text-[#20262D]"}`}>
          {tx.amount}
        </span>
        <span className="text-[11px] text-[#9CA3AF]">{tx.date}</span>
      </div>

      <FiChevronRight className="h-[18px] w-[18px] flex-shrink-0 text-[#C5D0D8]" />
    </div>
  );
}
