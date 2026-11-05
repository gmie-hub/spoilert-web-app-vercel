"use client";

import { useMemo, useState } from "react";

import { StatCard } from "@spt/components";
import useGetLecturersDashboardQuery from "@spt/hooks/apiRequests/useGetLecturersDashboardQuery";
import useGetLecturersEarningsTrendQuery from "@spt/hooks/apiRequests/useGetLecturersEarningsTrendQuery";
import { formatNaira } from "@spt/screens/institution/lecturers/utils";

import { LecturersIcon, RevenueIcon, SpoylzIcon, StudentsIcon } from "./components/icons";
import RevenueTrendChart from "./components/RevenueTrendChart";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, index) => CURRENT_YEAR - index);

const formatCount = (value: number | null, failed: boolean) =>
  failed || value == null ? null : value.toLocaleString("en-NG");

const formatMoney = (value: number | null, failed: boolean) => (failed ? null : formatNaira(value));

const filterControlClass =
  "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none";

const InstitutionDashboard = () => {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const {
    overview,
    isLoading: isLoadingOverview,
    isError: overviewFailed,
  } = useGetLecturersDashboardQuery();

  const {
    series: revenueTrend,
    isLoading: isLoadingTrend,
    isError: trendFailed,
  } = useGetLecturersEarningsTrendQuery({
    year,
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
  });

  const hasRevenueTrend = useMemo(
    () => revenueTrend.some((series) => series.values.some((value) => value > 0)),
    [revenueTrend],
  );

  const topStats = [
    {
      label: "Total Lecturers",
      value: formatCount(overview.totalLecturers, overviewFailed),
      isLoading: isLoadingOverview,
      icon: <LecturersIcon />,
      iconBg: "bg-orange-50",
    },
    {
      label: "Total Spoylz",
      value: formatCount(overview.totalSpoils, overviewFailed),
      isLoading: isLoadingOverview,
      icon: <SpoylzIcon />,
      iconBg: "bg-[var(--color-blue-lightest)]",
    },
    {
      label: "Total Students",
      value: formatCount(overview.totalStudents, overviewFailed),
      isLoading: isLoadingOverview,
      icon: <StudentsIcon />,
      iconBg: "bg-purple-50",
    },
    {
      label: "Total Revenue Generated Today",
      value: formatMoney(overview.revenueToday, overviewFailed),
      isLoading: isLoadingOverview,
      icon: <RevenueIcon color="#DC3545" />,
      iconBg: "bg-red-50",
    },
  ];

  const revenueStats = [
    {
      label: "Total Revenue Generated This Week",
      value: formatMoney(overview.revenueThisWeek, overviewFailed),
      isLoading: isLoadingOverview,
      icon: <RevenueIcon color="#0891B2" />,
      iconBg: "bg-cyan-50",
    },
    {
      label: "Total Revenue Generated This Month",
      value: formatMoney(overview.revenueThisMonth, overviewFailed),
      isLoading: isLoadingOverview,
      icon: <RevenueIcon color="#0D9488" />,
      iconBg: "bg-teal-50",
    },
    {
      label: "Total Revenue Generated Overtime",
      value: formatMoney(overview.revenueOvertime, overviewFailed),
      isLoading: isLoadingOverview,
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

          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Year"
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className={filterControlClass}
            >
              {YEAR_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === CURRENT_YEAR ? "This Year" : option}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2">
              <span className="text-sm text-gray-600">From</span>
              <input
                type="date"
                aria-label="From"
                value={fromDate}
                max={toDate || undefined}
                onChange={(event) => setFromDate(event.target.value)}
                className={filterControlClass}
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm text-gray-600">To</span>
              <input
                type="date"
                aria-label="To"
                value={toDate}
                min={fromDate || undefined}
                onChange={(event) => setToDate(event.target.value)}
                className={filterControlClass}
              />
            </label>
          </div>
        </div>

        <div className="mt-6">
          {isLoadingTrend ? (
            <div className="h-[300px] animate-pulse rounded-xl bg-gray-50" />
          ) : hasRevenueTrend ? (
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
                {trendFailed
                  ? "We couldn't load your revenue trend. Try again later."
                  : "Your revenue trend will show here once your institution starts earning."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
