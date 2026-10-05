import type { ReactNode } from "react";

const TONE_STYLES = {
  blue: { card: "bg-[var(--color-blue-lightest)]", icon: "bg-[var(--color-blue)]" },
  orange: { card: "bg-[var(--color-yellow-lighter)]", icon: "bg-[var(--color-yellow)]" },
  purple: { card: "bg-purple-50", icon: "bg-[#B5179E]" },
} as const;

// `value` null/undefined shows "No data"; that and the loading bar keep the
// value's line height, so the cards stay the same size.
const EarningsStatCard = ({
  tone,
  icon,
  label,
  value,
  isLoading = false,
}: {
  tone: keyof typeof TONE_STYLES;
  icon: ReactNode;
  label: string;
  value?: string | null;
  isLoading?: boolean;
}) => {
  const styles = TONE_STYLES[tone];

  return (
    <div className={`flex items-center gap-4 rounded-2xl border border-gray-100 p-5 ${styles.card}`}>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm text-[#212529]">{label}</p>
        {isLoading ? (
          <span className="mt-0.5 flex h-7 items-center">
            <span className="h-4 w-16 animate-pulse rounded bg-white/70" />
          </span>
        ) : value == null ? (
          <p className="mt-0.5 text-base leading-7 font-medium text-gray-400">No data</p>
        ) : (
          <p className="mt-0.5 text-xl font-semibold text-[#212529]">{value}</p>
        )}
      </div>
    </div>
  );
};

export default EarningsStatCard;
