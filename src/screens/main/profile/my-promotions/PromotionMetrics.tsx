"use client";

import { BsFillPersonPlusFill } from "react-icons/bs";
import { FaShareAlt } from "react-icons/fa";
import { FiEye, FiThumbsUp } from "react-icons/fi";
import { MdTouchApp } from "react-icons/md";

const metrics = [
  {
    label: "Total No of views",
    value: 40,
    icon: <FiEye size={28} className="text-[#003049]" />,
    bg: "bg-[#E6F4F7]",
    text: "text-[#003049]",
  },
  {
    label: "Total No of Clicks",
    value: 20,
    icon: <MdTouchApp size={28} className="text-[#1CC8A5]" />,
    bg: "bg-[#E6FAF7]",
    text: "text-[#1CC8A5]",
  },
  {
    label: "Total No of Likes",
    value: 15,
    icon: <FiThumbsUp size={28} className="text-[#C97B3E]" />,
    bg: "bg-[#FFF3EA]",
    text: "text-[#C97B3E]",
  },
  {
    label: "Total No of Shares",
    value: 5,
    icon: <FaShareAlt size={28} className="text-[#A259D9]" />,
    bg: "bg-[#F7F0FA]",
    text: "text-[#A259D9]",
  },
  {
    label: "Total No of Enrollment",
    value: 5,
    icon: <BsFillPersonPlusFill size={28} className="text-[#D96C82]" />,
    bg: "bg-[#F7E6EC]",
    text: "text-[#D96C82]",
  },
];

export default function PromotionMetrics() {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-3 mb-6">
        <select className="rounded-lg border border-[#E9EEF2] bg-white px-4 py-2 text-sm font-medium text-[#20262D] focus:outline-none">
          <option>Last 7 days</option>
        </select>
        <div className="flex items-center gap-2">
          <span className="text-[#8A98A3] text-sm">From</span>
          <input type="date" className="rounded-lg border border-[#E9EEF2] bg-white px-2 py-2 text-sm font-medium text-[#20262D] focus:outline-none" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#8A98A3] text-sm">To</span>
          <input type="date" className="rounded-lg border border-[#E9EEF2] bg-white px-2 py-2 text-sm font-medium text-[#20262D] focus:outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <div
            key={metric.label}
            className={`flex flex-col justify-between min-h-[110px] rounded-xl p-5 ${metric.bg}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/80 shadow-sm">
                {metric.icon}
              </span>
              <span className={`text-base font-medium ${metric.text}`}>{metric.label}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-[#20262D]">{metric.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
