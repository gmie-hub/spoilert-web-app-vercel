"use client";

import { useGetSpoilPerformanceQuery } from "@spt/hooks/apiRequests/useGetSpoilPerformanceQuery";

type Segment = { value: number; color: string };

const COURSE_COLORS = [
  "#1E3A8A",
  "#F59E0B",
  "#06B6D4",
  "#F97316",
  "#111827",
  "#3B82F6",
  "#84CC16",
];

const NOT_STARTED_COLORS = [
  "#EC4899",
  "#14B8A6",
  "#10B981",
  "#FBBF24",
  "#A7F3D0",
  "#22D3EE",
  "#D1D5DB",
];

function DonutChart({ segments }: { segments: Segment[] }) {
  const R = 38;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * R;
  const total = segments.reduce((s, d) => s + d.value, 0);
  let accumulated = 0;

  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 100 100"
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle cx="50" cy="50" r={R} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth} />
      {segments.map((seg, i) => {
        const dashLen = (seg.value / total) * circumference;
        const dashOffset = circumference - accumulated;
        accumulated += dashLen;
        return (
          <circle
            key={i}
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
            strokeDashoffset={dashOffset}
          />
        );
      })}
    </svg>
  );
}

function Legend({
  courses,
  values,
  colors,
  formatter,
}: {
  courses: string[];
  values: number[];
  colors: string[];
  formatter?: (v: number) => string;
}) {
  const fmt = formatter ?? ((v) => String(v));
  return (
    <div className="flex flex-col gap-2 mt-3">
      {courses.map((course, i) => (
        <div key={i} className="flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: colors[i] }}
            />
            <span className="text-[16px] text-[#495057] leading-snug">{course}</span>
          </div>
          <span className="ml-[18px] text-[18px] font-medium text-[#212529]">
            {fmt(values[i])}
          </span>
        </div>
      ))}
    </div>
  );
}

function ChartSection({
  title,
  courses,
  values,
  colors,
  formatter,
}: {
  title: string;
  courses: string[];
  values: number[];
  colors: string[];
  formatter?: (v: number) => string;
}) {
  const segments: Segment[] = values.map((value, i) => ({ value, color: colors[i] }));

  return (
    <div className="flex flex-col border border-[#EFEFEF]  rounded-[8px] px-4 py-6">
      <h3 className="text-[18px] font-semibold text-[#212529]">{title}</h3>
      <div className="mt-4">
        <DonutChart segments={segments} />
      </div>
      <Legend courses={courses} values={values} colors={colors} formatter={formatter} />
    </div>
  );
}

function formatRevenue(v: number) {
  return `N${v.toLocaleString()}`;
}

export default function SpoilPerformanceAnalyticsPage() {
  const { performance, isLoading, isError, errorMessage } = useGetSpoilPerformanceQuery();

  const enrolled = performance.learners_enrolled;
  const revenue = performance.revenue_generated;
  const completed = performance.completed_learners;
  const ongoing = performance.ongoing_learners;
  const notStarted = performance.not_started_learners;

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 rounded-full border-4 border-[#0B5368] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 text-sm py-8">{errorMessage}</p>
    );
  }

  if (enrolled.length === 0) {
    return (
      <p className="text-center text-gray-500 text-sm py-8">No performance data available.</p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-[18px] font-semibold text-[#212529]">Spoylz Performance Analytics</h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <ChartSection
          title="Learners Enrolled"
          courses={enrolled.map((s) => s.title)}
          values={enrolled.map((s) => s.total)}
          colors={COURSE_COLORS}
        />
        <ChartSection
          title="Revenue Generated"
          courses={revenue.map((s) => s.title)}
          values={revenue.map((s) => s.total)}
          colors={COURSE_COLORS}
          formatter={formatRevenue}
        />
        <ChartSection
          title="Completed Learners"
          courses={completed.map((s) => s.title)}
          values={completed.map((s) => s.total)}
          colors={COURSE_COLORS}
        />
        <ChartSection
          title="Ongoing Learners"
          courses={ongoing.map((s) => s.title)}
          values={ongoing.map((s) => s.total)}
          colors={COURSE_COLORS}
        />
      </div>

      <div className="sm:w-1/2 sm:pr-4">
        <ChartSection
          title="Not Started"
          courses={notStarted.map((s) => s.title)}
          values={notStarted.map((s) => s.total)}
          colors={NOT_STARTED_COLORS}
        />
      </div>
    </div>
  );
}

