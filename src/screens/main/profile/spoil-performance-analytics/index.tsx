"use client";

import { useGetSpoilPerformanceQuery } from "@spt/hooks/apiRequests/useGetSpoilPerformanceQuery";

import { assignSeries } from "./chartData";
import ChartSection from "./ChartSection";

// Pages the chart cards open as a whole.
const MY_SPOYLZ_HREF = "/profile/my-spoils";
const EARNINGS_BREAKDOWN_HREF = "/profile/earnings-breakdown";

// A Spoylz in the Learners Enrolled chart opens the list of its learners; in
// the other charts it opens its My Spoylz page.
const enrolledLearnersHref = (spoilId: number) =>
  `/my-spoils/${spoilId}/enrolled-learners`;

export default function SpoilPerformanceAnalyticsPage() {
  const { performance, isLoading, isError, errorMessage } = useGetSpoilPerformanceQuery();

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

  if (performance.learners_enrolled.length === 0) {
    return (
      <p className="text-center text-gray-500 text-sm py-8">No performance data available.</p>
    );
  }

  const series = assignSeries(performance);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-[18px] font-semibold text-[#212529]">Spoylz Performance Analytics</h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <ChartSection
          title="Learners Enrolled"
          href={MY_SPOYLZ_HREF}
          linkLabel="My Spoylz"
          itemHref={enrolledLearnersHref}
          items={performance.learners_enrolled}
          series={series}
        />
        <ChartSection
          title="Revenue Generated"
          href={EARNINGS_BREAKDOWN_HREF}
          linkLabel="Earnings"
          items={performance.revenue_generated}
          series={series}
          isCurrency
        />
        <ChartSection
          title="Completed Learners"
          href={MY_SPOYLZ_HREF}
          linkLabel="My Spoylz"
          items={performance.completed_learners}
          series={series}
        />
        <ChartSection
          title="Ongoing Learners"
          href={MY_SPOYLZ_HREF}
          linkLabel="My Spoylz"
          items={performance.ongoing_learners}
          series={series}
        />
      </div>

      <div className="sm:w-1/2 sm:pr-4">
        <ChartSection
          title="Not Started"
          href={MY_SPOYLZ_HREF}
          linkLabel="My Spoylz"
          items={performance.not_started_learners}
          series={series}
        />
      </div>
    </div>
  );
}
