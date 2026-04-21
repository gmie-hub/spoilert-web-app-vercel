"use client";

import { FaCheck } from "react-icons/fa";
import { FiBookOpen, FiTrendingUp } from "react-icons/fi";
import { HiOutlineUsers } from "react-icons/hi";
import { MdOutlineLibraryBooks } from "react-icons/md";

const stats = [
  {
    label: "Enrolled Spoils",
    value: 10,
    icon: <FiBookOpen size={28} className="text-[#C97B3E]" />,
    bg: "bg-[#FFF0E4]",
    border: "border-[#F9D0B0]",

  },
  {
    label: "Joined Communities",
    value: 8,
    icon: <HiOutlineUsers size={28} className="text-[#F35B5B]" />,
    bg: "bg-[#FFECEC]",
     border: "border-[#FFCECE]",

  },
  {
    label: "Ongoing Spoils",
    value: 6,
    icon: <MdOutlineLibraryBooks size={28} className="text-[#A259D9]" />,
    bg: "bg-[#F9F0FA]",
    border: "text-[#E6B1EB]",
  },
  {
    label: "Completed Spoils",
    value: 4,
    icon: <FaCheck size={28} className="text-[#1CC8A5]" />,
    bg: "bg-[#ECFFFD]",
    border: "text-[#96E1DA]",
    check: false,
  },
  {
    label: "Spoils Created",
    value: 8,
    icon: <FiTrendingUp size={28} className="text-[#003049]" />,
    bg: "bg-[#E3F5FA]",
    border: "text-[#A5D1DE]",
  },
];

export default function SpoilStatsPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-6 text-[#20262D]">Spoil Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className={`flex flex-col justify-between min-h-[110px] rounded-xl p-5 ${stat.bg} ${idx === 3 || idx === 4 ? "sm:col-span-1 md:col-span-1" : ""}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/80 shadow-sm">
                {stat.icon}
              </span>
              <span className='text-base font-medium text-[#495057]'>
                {stat.label}
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-[#212529]">
                {stat.value}
              </span>
              {stat.check && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1CC8A5] text-white">
                  <FaCheck size={14} />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
