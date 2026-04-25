"use client";

import Image, { type StaticImageData } from "next/image";
import { HiOutlineUsers } from "react-icons/hi";
import { MdOutlineAutoGraph } from "react-icons/md";
import walleticon from "@spt/assets/icons/wallet-3.svg";
import AboutUsImage from "@spt/assets/images/aboutus3.svg";
import ProfileIcon from "@spt/assets/icons/profile-2user.svg";
import TotalIcon from "@spt/assets/icons/totalIcons.svg";
import CreatedIcon from "@spt/assets/icons/scicon.svg";

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
    <div className="flex items-stretch gap-3 rounded-xl border-1 border-[#2222220D] bg-white p-4 shadow-sm">
      <div className="relative h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded-[16px]">
        <Image
          src={spoil.thumbnail}
          alt={spoil.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        <p className="line-clamp-2 md:text-[16px]  leading-snug text-[#212529] sm:text-[14px]">
          {spoil.title}
        </p>
        <div className="flex items-center gap-1 text-[14px] text-[#495057]">
                <Image
            src={ProfileIcon}
            alt="profile icon"
            className="h-[20px] w-[20px] flex-shrink-0 text-[#6B7B8D]"
          />
          <span>{spoil.enrolled} Enrolled</span>
        </div>
        <div className="flex items-center gap-1 text-[14px] text-[#212529]">
          <Image
            src={walleticon}
            alt="wallet icon"
            className="h-[20px] w-[20px] flex-shrink-0 text-[#6B7B8D]"
          />{" "}
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
        <h2 className="text-[18px] font-semibold text-[#212529]">
          Earnings Breakdown
        </h2>
        <p className="mt-1 text-[16px] text-[#495057]">
          Track your earnings from all your published Spoils
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Total Earnings */}
        <div className="flex flex-col gap-3 rounded-xl border border-[#A5D1DE] bg-[#E3F5FA] px-5 py-5">
          <div className="flex items-center gap-2">
              <Image src={TotalIcon} alt="wallet icon" className="h-10 w-10" />
            
            <p className="text-[14px] font-medium text-[#495057]">Total Earnings</p>
          </div>
          <p className="text-[18px] font-semibold text-[#212529]">₦800,00.00</p>
        </div>

        {/* Spoils Created */}
        <div className="flex flex-col gap-3 rounded-xl border border-[#F9D0B0] bg-[#FEF0E7] px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#F97316]">
              <Image src={CreatedIcon} alt="created icon" className="h-10 w-10 text-white" />
            </div>
            <p className="text-[14px] font-medium text-[#495057]">Spoils Created</p>
          </div>
          <p className="text-[18px] font-semibold text-[#212529]">25</p>
        </div>
      </div>

      {/* Spoils Earnings Breakdown List */}
      <div>
        <h3 className="mb-4 text-[16px] font-medium text-[#212529]">
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
