"use client";

import type { EnrolledLearnersFilters } from "@spt/hooks/apiRequests/useGetEnrolledLearnersQuery";
import { useGetSpoilPerformanceQuery } from "@spt/hooks/apiRequests/useGetSpoilPerformanceQuery";

import { assignSeries } from "./chartData";
import ChartSection from "./ChartSection";

// Pages the chart cards open as a whole.
const MY_SPOYLZ_HREF = "/profile/my-spoils";
const TRANSACTION_HISTORY_HREF = "/profile/transaction-history";

// A Spoylz in one of the learner charts opens the list of its learners,
// filtered to that chart's status.
const enrolledLearnersHref =
  (status?: EnrolledLearnersFilters["status"]) => (spoilId: number) =>
    `/my-spoils/${spoilId}/enrolled-learners${status ? `?status=${status}` : ""}`;

// A Spoylz in Revenue Generated opens its earnings breakdown.
const earningsDetailsHref = (spoilId: number) =>
  `/profile/earnings-breakdown/details?spoilId=${spoilId}`;

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

      {/* Two independent columns, so opening "Show all" on a card only pushes
          down the cards under it. On phones the columns dissolve into one list
          and `order` keeps the cards in reading order. */}
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="contents sm:flex sm:min-w-0 sm:flex-1 sm:flex-col sm:gap-8">
          <ChartSection
            title="Learners Enrolled"
            href={MY_SPOYLZ_HREF}
            linkLabel="My Spoylz"
            itemHref={enrolledLearnersHref()}
            items={performance.learners_enrolled}
            series={series}
            className="order-1 sm:order-none"
          />
          <ChartSection
            title="Completed Learners"
            href={MY_SPOYLZ_HREF}
            linkLabel="My Spoylz"
            itemHref={enrolledLearnersHref("completed")}
            items={performance.completed_learners}
            series={series}
            className="order-3 sm:order-none"
          />
          <ChartSection
            title="Not Started"
            href={MY_SPOYLZ_HREF}
            linkLabel="My Spoylz"
            itemHref={enrolledLearnersHref("not_started")}
            items={performance.not_started_learners}
            series={series}
            className="order-5 sm:order-none"
          />
        </div>

        <div className="contents sm:flex sm:min-w-0 sm:flex-1 sm:flex-col sm:gap-8">
          <ChartSection
            title="Revenue Generated"
            href={TRANSACTION_HISTORY_HREF}
            linkLabel="Earnings"
            itemHref={earningsDetailsHref}
            items={performance.revenue_generated}
            series={series}
            isCurrency
            className="order-2 sm:order-none"
          />
          <ChartSection
            title="Ongoing Learners"
            href={MY_SPOYLZ_HREF}
            linkLabel="My Spoylz"
            itemHref={enrolledLearnersHref("ongoing")}
            items={performance.ongoing_learners}
            series={series}
            className="order-4 sm:order-none"
          />
        </div>
      </div>
    </div>
  );
}
