"use client";

import Image, { type StaticImageData } from "next/image";
import { HiOutlineUsers } from "react-icons/hi";
import { LuFileText, LuWallet } from "react-icons/lu";
import { MdOutlineAutoGraph } from "react-icons/md";

import AboutUsImage from "@spt/assets/images/aboutus3.svg";

interface SpoilEarning {
  id: string;
  title: string;
  thumbnail: StaticImageData | string;
  enrolled: number;
  earnings: string;
}

const dummySpoils: SpoilEarning[] = [
  {
    id: "1",
    title: "BCH 404- Biological Pharmacology",
    thumbnail: AboutUsImage,
    enrolled: 12,
    earnings: "₦100,000",
  },
  {
    id: "2",
    title: "Building Design Systems",
    thumbnail: AboutUsImage,
    enrolled: 8,
    earnings: "₦50,000",
  },
  {
    id: "3",
    title: "Design Principles",
    thumbnail: AboutUsImage,
    enrolled: 32,
    earnings: "₦400,000",
  },
  {
    id: "4",
    title: "Branding",
    thumbnail: AboutUsImage,
    enrolled: 15,
    earnings: "₦100,000",
  },
  {
    id: "5",
    title: "CHM501-IUPAC Nomenclature",
    thumbnail: AboutUsImage,
    enrolled: 12,
    earnings: "₦200,000",
  },
  {
    id: "6",
    title: "Fundamentals of Frontend Development",
    thumbnail: AboutUsImage,
    enrolled: 100,
    earnings: "₦100,000",
  },
  {
    id: "7",
    title: "BCH 404- Biological Pharmacology",
    thumbnail: AboutUsImage,
    enrolled: 12,
    earnings: "₦100,000",
  },
  {
    id: "8",
    title: "BCH 404- Biological Pharmacology",
    thumbnail: AboutUsImage,
    enrolled: 12,
    earnings: "₦100,000",
  },
];

function SpoilEarningCard({ spoil }: { spoil: SpoilEarning }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#EEF3F6] bg-white p-3 shadow-sm">
      <div className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-lg sm:h-[80px] sm:w-[80px]">
        <Image
          src={spoil.thumbnail}
          alt={spoil.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#20262D] sm:text-[14px]">
          {spoil.title}
        </p>
        <div className="flex items-center gap-1.5 text-[12px] text-[#6B7B8D]">
          <HiOutlineUsers className="h-[14px] w-[14px] flex-shrink-0 text-[#6B7B8D]" />
          <span>{spoil.enrolled} Enrolled</span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#6B7B8D]">
          <LuFileText className="h-[14px] w-[14px] flex-shrink-0 text-[#6B7B8D]" />
          <span>{spoil.earnings}</span>
        </div>
      </div>
    </div>
  );
}

export default function EarningsBreakdownPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-[20px] font-semibold text-[#20262D]">
          Earnings Breakdown
        </h2>
        <p className="mt-1 text-[13px] text-[#6B7B8D]">
          Track your earnings from all your published Spoils
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Total Earnings */}
        <div className="flex items-center gap-4 rounded-2xl bg-[#0B5368] px-5 py-5">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#ffffff1a]">
            <LuWallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#ffffffb3]">
              Total Earnings
            </p>
            <p className="mt-0.5 text-[22px] font-bold leading-tight text-white sm:text-[26px]">
              ₦800,00.00
            </p>
          </div>
        </div>

        {/* Spoils Created */}
        <div className="flex items-center gap-4 rounded-2xl bg-[#FEF0E7] px-5 py-5">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#F97316]/20">
            <MdOutlineAutoGraph className="h-5 w-5 text-[#F97316]" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#8C6A50]">
              Spoils Created
            </p>
            <p className="mt-0.5 text-[26px] font-bold leading-tight text-[#20262D] sm:text-[30px]">
              25
            </p>
          </div>
        </div>
      </div>

      {/* Spoils Earnings Breakdown List */}
      <div>
        <h3 className="mb-4 text-[15px] font-semibold text-[#20262D]">
          Spoils Earnings Breakdown
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {dummySpoils.map((spoil) => (
            <SpoilEarningCard key={spoil.id} spoil={spoil} />
          ))}
        </div>
      </div>
    </div>
  );
}
