"use client";

import { StatCard } from "@spt/components";

import RevenueTrendChart from "./components/RevenueTrendChart";
import { LecturersIcon, RevenueIcon, SpoylzIcon, StudentsIcon } from "./components/icons";

const TOP_STATS = [
  { label: "Total Lecturers", value: "50", icon: <LecturersIcon />, iconBg: "bg-orange-50" },
  { label: "Total Spoylz", value: "5,000", icon: <SpoylzIcon />, iconBg: "bg-[var(--color-blue-lightest)]" },
  { label: "Total Students", value: "18,000", icon: <StudentsIcon />, iconBg: "bg-purple-50" },
  {
    label: "Total Revenue Generated Today",
    value: "₦10,000",
    icon: <RevenueIcon color="#DC3545" />,
    iconBg: "bg-red-50",
  },
];

const REVENUE_STATS = [
  {
    label: "Total Revenue Generated This Week",
    value: "₦400,000",
    icon: <RevenueIcon color="#0891B2" />,
    iconBg: "bg-cyan-50",
  },
  {
    label: "Total Revenue Generated This Month",
    value: "₦700,000",
    icon: <RevenueIcon color="#0D9488" />,
    iconBg: "bg-teal-50",
  },
  {
    label: "Total Revenue Generated Overtime",
    value: "₦2,150,000",
    icon: <RevenueIcon color="#6D28D9" />,
    iconBg: "bg-indigo-50",
  },
];

const InstitutionDashboard = () => (
  <div className="w-full">
    <h1 className="text-2xl font-semibold text-[#212529]">Overview</h1>

    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {TOP_STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>

    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {REVENUE_STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>

    <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[#212529]">Revenue Trend</h2>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600"
          >
            This Year
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
      </div>

      <div className="mt-6">
        <RevenueTrendChart />
      </div>
    </div>
  </div>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="#9CA3AF" strokeWidth="1.6" />
    <path d="M3 9.5h18" stroke="#9CA3AF" strokeWidth="1.6" />
    <path d="M8 3v3M16 3v3" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export default InstitutionDashboard;
