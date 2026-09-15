import { StatCard } from "@spt/components";

import { NetworkIcon, PeopleIcon } from "../../../lecturers/components/icons";

import { EyeIcon, ThumbsUpIcon } from "./metricsIcons";

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="#9CA3AF" strokeWidth="1.6" />
    <path d="M3 9.5h18" stroke="#9CA3AF" strokeWidth="1.6" />
    <path d="M8 3v3M16 3v3" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const METRICS = [
  {
    label: "Total Number of Views",
    value: "2,000",
    icon: <EyeIcon color="#0891B2" />,
    iconBg: "bg-cyan-50",
  },
  {
    label: "Total Number of Likes",
    value: "1,200",
    icon: <ThumbsUpIcon color="#EC4899" />,
    iconBg: "bg-pink-50",
  },
  {
    label: "Total Number of Shares",
    value: "2,000",
    icon: <NetworkIcon color="#B5179E" />,
    iconBg: "bg-purple-50",
  },
  {
    label: "Total Number of Enrollments",
    value: "1,200",
    icon: <PeopleIcon color="#4F46E5" />,
    iconBg: "bg-indigo-50",
  },
];

const SpoylzMetricsTab = () => (
  <div className="space-y-5">
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600"
      >
        Last 7 days
        <ChevronDownIcon />
      </button>
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600"
      >
        From
        <CalendarIcon />
      </button>
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600"
      >
        To
        <CalendarIcon />
      </button>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {METRICS.map((metric) => (
        <StatCard key={metric.label} {...metric} />
      ))}
    </div>
  </div>
);

export default SpoylzMetricsTab;
