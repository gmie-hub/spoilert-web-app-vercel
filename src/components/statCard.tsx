import type { ReactNode } from "react";

// `value` null/undefined shows "No data"; both that and the loading bar keep the
// value's line height, so every card stays the same size.
const StatCard = ({
  icon,
  iconBg,
  label,
  value,
  isLoading = false,
}: {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value?: string | null;
  isLoading?: boolean;
}) => (
  <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
      {icon}
    </span>
    <div className="min-w-0">
      <p className="text-sm text-gray-400">{label}</p>
      {isLoading ? (
        <span className="mt-0.5 flex h-7 items-center">
          <span className="h-4 w-16 animate-pulse rounded bg-gray-100" />
        </span>
      ) : value == null ? (
        <p className="mt-0.5 text-base leading-7 font-medium text-gray-300">No data</p>
      ) : (
        <p className="mt-0.5 text-xl font-semibold text-[#212529]">{value}</p>
      )}
    </div>
  </div>
);

export default StatCard;
