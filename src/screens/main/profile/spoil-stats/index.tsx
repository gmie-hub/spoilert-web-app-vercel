"use client";

import Image from "next/image";

import Completed from "@spt/assets/icons/completedspo.svg";
import Created from "@spt/assets/icons/created.svg";
import Enrolled from "@spt/assets/icons/enrol.svg";
import Joined from "@spt/assets/icons/joined.svg";
import Ongoing from "@spt/assets/icons/onging.svg";
import { useGetLearnerOverviewQuery } from "@spt/hooks/apiRequests/useGetLearnerOverviewQuery";

const dummyStats = [
  {
    label: "Enrolled Spoils",
    value: 10,
    icon: <Image src={Enrolled} alt="Enrolled Icon" width={40} height={40} />, // SVG icon
    bg: "bg-[#FFF0E4]",
    border: "border-[#F9D0B0]",
  },
  {
    label: "Joined Communities",
    value: 8,
    bg: "bg-[#FFECEC]",
    border: "border-[#FFCECE]",
    icon: <Image src={Joined} alt="Joined Icon" width={40} height={40} />, // SVG icon
  },
  {
    label: "Ongoing Spoils",
    value: 6,
    bg: "bg-[#F9F0FA]",
    border: "text-[#E6B1EB]",
    icon: <Image src={Ongoing} alt="Ongoing Icon" width={40} height={40} />, // SVG icon
  },
  {
    label: "Completed Spoils",
    value: 4,
    bg: "bg-[#ECFFFD]",
    border: "text-[#96E1DA]",
    check: false,
    icon: <Image src={Completed} alt="Completed Icon" width={40} height={40} />, // SVG icon
  },
  {
    label: "Spoils Created",
    value: 8,
    bg: "bg-[#E3F5FA]",
    border: "text-[#A5D1DE]",
    icon: <Image src={Created} alt="Completed Icon" width={40} height={40} />, // SVG icon
  },
];

export default function SpoilStatsPage() {
  const { data, isLoading, isError } = useGetLearnerOverviewQuery();
  // Map backend data to the stats UI, fallback to dummy if no data
  const stats = data && !isError
    ? [
        {
          label: "Enrolled Spoils",
          value: data.total_spoils_enrolled ?? 0,
          icon: <Image src={Enrolled} alt="Enrolled Icon" width={40} height={40} />,
          bg: "bg-[#FFF0E4]",
          border: "border-[#F9D0B0]",
        },
        {
          label: "Joined Communities",
          value: data.communities_joined ?? 0,
          bg: "bg-[#FFECEC]",
          border: "border-[#FFCECE]",
          icon: <Image src={Joined} alt="Joined Icon" width={40} height={40} />,
        },
        {
          label: "Ongoing Spoils",
          value: data.total_ongoing_spoils ?? 0,
          bg: "bg-[#F9F0FA]",
          border: "text-[#E6B1EB]",
          icon: <Image src={Ongoing} alt="Ongoing Icon" width={40} height={40} />,
        },
        {
          label: "Completed Spoils",
          value: data.total_completed_spoils ?? 0,
          bg: "bg-[#ECFFFD]",
          border: "text-[#96E1DA]",
          check: false,
          icon: <Image src={Completed} alt="Completed Icon" width={40} height={40} />,
        },
        {
          label: "Spoils Created",
          value: data.spoils_created ?? 0,
          bg: "bg-[#E3F5FA]",
          border: "text-[#A5D1DE]",
          icon: <Image src={Created} alt="Completed Icon" width={40} height={40} />,
        },
      ]
    : dummyStats;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6 text-[#20262D]">Spoil Stats</h2>
      {isLoading && <div>Loading stats...</div>}
      {isError && <div>Failed to load stats.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className={`flex flex-col justify-between min-h-[110px] rounded-xl p-5 ${stat.bg} ${idx === 3 || idx === 4 ? "sm:col-span-1 md:col-span-1" : ""}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-[8px]">
                {stat.icon}
              </span>
              <span className="text-base font-medium text-[#495057]">
                {stat.label}
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-[#212529]">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
