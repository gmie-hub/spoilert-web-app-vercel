import type { ReactNode } from "react";

const StatCard = ({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
      {icon}
    </span>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-0.5 text-xl font-semibold text-[#212529]">{value}</p>
    </div>
  </div>
);

export default StatCard;
