"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  if (total <= 1) return null;

  const pages: (number | "…")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("…");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("…");
    pages.push(total);
  }

  return (
    <div className="flex items-center justify-center gap-1 py-4 shrink-0">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7B8D] transition-colors hover:bg-[#EEF3F6] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FiChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-[13px] text-[#9CA3AF]">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
              p === current
                ? "bg-[#0B5368] text-white"
                : "text-[#6B7B8D] hover:bg-[#EEF3F6]"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7B8D] transition-colors hover:bg-[#EEF3F6] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FiChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
