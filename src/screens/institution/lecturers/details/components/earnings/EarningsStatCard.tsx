import type { ReactNode } from "react";

const TONE_STYLES = {
  blue: { card: "bg-[var(--color-blue-lightest)]", icon: "bg-[var(--color-blue)]" },
  orange: { card: "bg-[var(--color-yellow-lighter)]", icon: "bg-[var(--color-yellow)]" },
  purple: { card: "bg-purple-50", icon: "bg-[#B5179E]" },
} as const;

const EarningsStatCard = ({
  tone,
  icon,
  label,
  value,
}: {
  tone: keyof typeof TONE_STYLES;
  icon: ReactNode;
  label: string;
  value: string;
}) => {
  const styles = TONE_STYLES[tone];

  return (
    <div className={`flex items-center gap-4 rounded-2xl border border-gray-100 p-5 ${styles.card}`}>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
        {icon}
      </span>
      <div>
        <p className="text-sm text-[#212529]">{label}</p>
        <p className="mt-0.5 text-xl font-semibold text-[#212529]">{value}</p>
      </div>
    </div>
  );
};

export default EarningsStatCard;
