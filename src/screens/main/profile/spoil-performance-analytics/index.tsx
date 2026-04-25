"use client";

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

const COURSES = [
  "Introduction to Design Principles",
  "CHM 204- Pharmacological Biochemistry",
  "Introduction to Finance",
  "Business Analytics",
  "Enterpreneurship",
  "Medical Laboratory Science",
  "Software Development",
];

const ENROLLED_VALUES = [20, 10, 50, 30, 70, 15, 48];
const REVENUE_VALUES = [20000, 10000, 50000, 200000, 500000, 120000, 85000];
const COMPLETED_VALUES = [10, 5, 30, 20, 50, 10, 18];
const ONGOING_VALUES = [5, 2, 14, 10, 16, 4, 20];
const NOT_STARTED_VALUES = [4, 5, 16, 8, 10, 7, 20];

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
  values,
  colors,
  formatter,
}: {
  values: number[];
  colors: string[];
  formatter?: (v: number) => string;
}) {
  const fmt = formatter ?? ((v) => String(v));
  return (
    <div className="flex flex-col gap-2 mt-3">
      {COURSES.map((course, i) => (
        <div key={course} className="flex flex-col">
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
  values,
  colors,
  formatter,
}: {
  title: string;
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
      <Legend values={values} colors={colors} formatter={formatter} />
    </div>
  );
}

function formatRevenue(v: number) {
  return `N${v.toLocaleString()}`;
}

export default function SpoilPerformanceAnalyticsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-[18px] font-semibold text-[#212529]">Spoil Performance Analytics</h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <ChartSection
          title="Learners Enrolled"
          values={ENROLLED_VALUES}
          colors={COURSE_COLORS}
        />
        <ChartSection
          title="Revenue Generated"
          values={REVENUE_VALUES}
          colors={COURSE_COLORS}
          formatter={formatRevenue}
        />
        <ChartSection
          title="Completed Learners"
          values={COMPLETED_VALUES}
          colors={COURSE_COLORS}
        />
        <ChartSection
          title="Ongoing Learners"
          values={ONGOING_VALUES}
          colors={COURSE_COLORS}
        />
      </div>

      <div className="sm:w-1/2 sm:pr-4">
        <ChartSection
          title="Not Started"
          values={NOT_STARTED_VALUES}
          colors={NOT_STARTED_COLORS}
        />
      </div>
    </div>
  );
}
