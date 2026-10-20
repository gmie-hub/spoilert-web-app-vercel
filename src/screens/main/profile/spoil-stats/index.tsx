"use client";

import Image from "next/image";
import Link from "next/link";

import Completed from "@spt/assets/icons/completedspo.svg";
import Created from "@spt/assets/icons/created.svg";
import Enrolled from "@spt/assets/icons/enrol.svg";
import Joined from "@spt/assets/icons/joined.svg";
import Ongoing from "@spt/assets/icons/onging.svg";
import { useGetLearnerOverviewQuery } from "@spt/hooks/apiRequests/useGetLearnerOverviewQuery";
import { useAuthStore } from "@spt/store/authStore";

// Page each stat card opens. "Spoylz Created" opens My Spoylz, which (like the
// sidebar link) is only offered to tutors.
const statHrefs = {
  enrolled: "/my-learnings",
  joined: "/community?tab=joined",
  ongoing: "/my-learnings?tab=ongoing",
  completed: "/my-learnings?tab=completed",
  created: "/profile/my-spoils",
};

const dummyStats = [
  {
    label: "Enrolled Spoylz",
    value: 10,
    href: statHrefs.enrolled,
    icon: <Image src={Enrolled} alt="Enrolled Icon" width={40} height={40} />, // SVG icon
    bg: "bg-[#FFF0E4]",
    border: "border-[#F9D0B0]",
  },
  {
    label: "Joined Communities",
    value: 8,
    href: statHrefs.joined,
    bg: "bg-[#FFECEC]",
    border: "border-[#FFCECE]",
    icon: <Image src={Joined} alt="Joined Icon" width={40} height={40} />, // SVG icon
  },
  {
    label: "Ongoing Spoylz",
    value: 6,
    href: statHrefs.ongoing,
    bg: "bg-[#F9F0FA]",
    border: "text-[#E6B1EB]",
    icon: <Image src={Ongoing} alt="Ongoing Icon" width={40} height={40} />, // SVG icon
  },
  {
    label: "Completed Spoylz",
    value: 4,
    href: statHrefs.completed,
    bg: "bg-[#ECFFFD]",
    border: "text-[#96E1DA]",
    check: false,
    icon: <Image src={Completed} alt="Completed Icon" width={40} height={40} />, // SVG icon
  },
  {
    label: "Spoylz Created",
    value: 8,
    href: statHrefs.created,
    bg: "bg-[#E3F5FA]",
    border: "text-[#A5D1DE]",
    icon: <Image src={Created} alt="Completed Icon" width={40} height={40} />, // SVG icon
  },
];

export default function SpoilStatsPage() {
  const { data, isLoading, isError } = useGetLearnerOverviewQuery();
  const isTutor = useAuthStore((state) => state.user)?.role === "tutor";
  // Map backend data to the stats UI, fallback to dummy if no data
  const stats = data && !isError
    ? [
        {
          label: "Enrolled Spoylz",
          value: data.total_spoils_enrolled ?? 0,
          href: statHrefs.enrolled,
          icon: <Image src={Enrolled} alt="Enrolled Icon" width={40} height={40} />,
          bg: "bg-[#FFF0E4]",
          border: "border-[#F9D0B0]",
        },
        {
          label: "Joined Communities",
          value: data.communities_joined ?? 0,
          href: statHrefs.joined,
          bg: "bg-[#FFECEC]",
          border: "border-[#FFCECE]",
          icon: <Image src={Joined} alt="Joined Icon" width={40} height={40} />,
        },
        {
          label: "Ongoing Spoylz",
          value: data.total_ongoing_spoils ?? 0,
          href: statHrefs.ongoing,
          bg: "bg-[#F9F0FA]",
          border: "text-[#E6B1EB]",
          icon: <Image src={Ongoing} alt="Ongoing Icon" width={40} height={40} />,
        },
        {
          label: "Completed Spoylz",
          value: data.total_completed_spoils ?? 0,
          href: statHrefs.completed,
          bg: "bg-[#ECFFFD]",
          border: "text-[#96E1DA]",
          check: false,
          icon: <Image src={Completed} alt="Completed Icon" width={40} height={40} />,
        },
        {
          label: "Spoylz Created",
          value: data.spoils_created ?? 0,
          href: statHrefs.created,
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
        {stats.map((stat, idx) => {
          const href =
            stat.href === statHrefs.created && !isTutor ? undefined : stat.href;
          const className = `flex flex-col justify-between min-h-[110px] rounded-xl p-5 ${stat.bg} ${idx === 3 || idx === 4 ? "sm:col-span-1 md:col-span-1" : ""}`;
          const content = (
            <>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-[8px]">
                  {stat.icon}
                </span>
                <span className="text-base font-medium text-[#495057]">
                  {stat.label}
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-[18px] font-semibold text-[#212529]">
                  {stat.value}
                </span>
              </div>
            </>
          );

          return href ? (
            <Link
              key={stat.label}
              href={href}
              className={`${className} cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5368]/30`}
            >
              {content}
            </Link>
          ) : (
            <div key={stat.label} className={className}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
