import type { ReactNode } from "react";

import { CheckIcon } from "./icons";

export interface DetailRow {
  label: string;
  value?: string | null;
  /** inline control shown after the value, e.g. an "Edit" link */
  action?: ReactNode;
}

// Phone and bank cards sit side by side, so the layout is fixed: the
// description reserves two lines, missing values keep their row as "—", and the
// footer is pinned to the bottom — both cards always match in size.
const VerificationCard = ({
  icon,
  iconBg,
  title,
  description,
  verified,
  pendingLabel,
  rows,
  footer,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  description: string;
  verified: boolean;
  pendingLabel: string;
  rows: DetailRow[];
  footer: ReactNode;
}) => (
  <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </span>
        <h2 className="truncate text-lg font-semibold text-[#212529]">{title}</h2>
      </div>

      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
          verified ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
        }`}
      >
        {verified && <CheckIcon />}
        {verified ? "Verified" : pendingLabel}
      </span>
    </div>

    <p className="mt-4 line-clamp-2 min-h-10 text-sm text-gray-500">{description}</p>

    <dl className="mt-4">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-4 border-b border-gray-100 py-3 last:border-0"
        >
          <dt className="shrink-0 text-sm text-gray-400">{row.label}</dt>
          <dd className="flex min-w-0 items-center gap-3 text-sm font-medium text-[#212529]">
            <span className="truncate">{row.value || "—"}</span>
            {row.action}
          </dd>
        </div>
      ))}
    </dl>

    <div className="mt-auto pt-6">{footer}</div>
  </div>
);

export default VerificationCard;
