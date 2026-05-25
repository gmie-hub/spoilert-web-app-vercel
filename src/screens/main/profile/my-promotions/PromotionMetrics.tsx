"use client";

import Image from "next/image";

import noclick from "@spt/assets/icons/noclick.svg";
import noenroll from "@spt/assets/icons/noenroll.svg";
import nolike from "@spt/assets/icons/nolike.svg";
import noshare from "@spt/assets/icons/noshare.svg";
import noview from "@spt/assets/icons/noview.svg";

const metrics = [
  {
    label: "Total No of views",
    value: 40,
    icon: <Image src={noview} alt="Views" width={40} height={40} />,
    bg: "bg-[#E6F4F7]",
    text: "text-[#003049]",
  },
  {
    label: "Total No of Clicks",
    value: 20,
    icon: <Image src={noclick} alt="Clicks" width={40} height={40} />,
    bg: "bg-[#E6FAF7]",
    text: "text-[#1CC8A5]",
  },
  {
    label: "Total No of Likes",
    value: 15,
    icon: <Image src={nolike} alt="Likes" width={40} height={40} />,
    bg: "bg-[#FFF3EA]",
    text: "text-[#C97B3E]",
  },
  {
    label: "Total No of Shares",
    value: 5,
    icon: <Image src={noshare} alt="Shares" width={40} height={40} />,
    bg: "bg-[#F7F0FA]",
    text: "text-[#A259D9]",
  },
  {
    label: "Total No of Enrollment",
    value: 5,
    icon: <Image src={noenroll} alt="Enrollment" width={40} height={40} />,
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
            key={idx}
            className={`flex flex-col justify-between min-h-[110px] rounded-xl p-5 ${metric.bg}`}
          >
            <div className="flex items-center gap-3 mb-2">
              {/* <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/80 shadow-sm"> */}
                {metric.icon}
              {/* </span> */}
              <span className="text-base font-medium text-[#495057]">{metric.label}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-[18px] font-semibold text-[#212529]">{metric.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
