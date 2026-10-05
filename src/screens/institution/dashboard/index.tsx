"use client";

import { StatCard } from "@spt/components";
import useGetLecturersQuery from "@spt/hooks/apiRequests/useGetLecturersQuery";

import { LecturersIcon, RevenueIcon, SpoylzIcon, StudentsIcon } from "./components/icons";
import RevenueTrendChart, { type RevenueSeries } from "./components/RevenueTrendChart";

// No endpoint serves these yet, so they show "No data" rather than made-up
// figures. Fill them in (and `revenueTrend` below) once the backend provides one.
const NOT_AVAILABLE = null;

const InstitutionDashboard = () => {
  const {
    total: totalLecturers,
    isLoading: isLoadingLecturers,
    isError: lecturersFailed,
  } = useGetLecturersQuery();

  const revenueTrend: RevenueSeries[] = [];
  const hasRevenueTrend = revenueTrend.some((series) => series.values.some((value) => value > 0));

  const topStats = [
    {
      label: "Total Lecturers",
      value: lecturersFailed ? null : totalLecturers.toLocaleString("en-NG"),
      isLoading: isLoadingLecturers,
      icon: <LecturersIcon />,
      iconBg: "bg-orange-50",
    },
    {
      label: "Total Spoylz",
      value: NOT_AVAILABLE,
      icon: <SpoylzIcon />,
      iconBg: "bg-[var(--color-blue-lightest)]",
    },
    {
      label: "Total Students",
      value: NOT_AVAILABLE,
      icon: <StudentsIcon />,
      iconBg: "bg-purple-50",
    },
    {
      label: "Total Revenue Generated Today",
      value: NOT_AVAILABLE,
      icon: <RevenueIcon color="#DC3545" />,
      iconBg: "bg-red-50",
    },
  ];

  const revenueStats = [
    {
      label: "Total Revenue Generated This Week",
      value: NOT_AVAILABLE,
      icon: <RevenueIcon color="#0891B2" />,
      iconBg: "bg-cyan-50",
    },
    {
      label: "Total Revenue Generated This Month",
      value: NOT_AVAILABLE,
      icon: <RevenueIcon color="#0D9488" />,
      iconBg: "bg-teal-50",
    },
    {
      label: "Total Revenue Generated Overtime",
      value: NOT_AVAILABLE,
      icon: <RevenueIcon color="#6D28D9" />,
      iconBg: "bg-indigo-50",
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-[#212529]">Overview</h1>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {topStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {revenueStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#212529]">Revenue Trend</h2>

          {/* Nothing to filter until there's data. */}
          {hasRevenueTrend && (
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
          )}
        </div>

        <div className="mt-6">
          {hasRevenueTrend ? (
            <RevenueTrendChart series={revenueTrend} />
          ) : (
            <div className="flex h-[300px] flex-col items-center justify-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 3v18h18" stroke="#9CA3AF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 15l4-4 3 3 5-6" stroke="#9CA3AF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="mt-3 text-sm font-medium text-[#212529]">No data</p>
              <p className="mt-1 max-w-xs text-sm text-gray-400">
                Your revenue trend will show here once your institution starts earning.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="#9CA3AF" strokeWidth="1.6" />
    <path d="M3 9.5h18" stroke="#9CA3AF" strokeWidth="1.6" />
    <path d="M8 3v3M16 3v3" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export default InstitutionDashboard;
