"use client";

import Image from "next/image";

import ProfileIcon from "@spt/assets/icons/profile-2user.svg";
import CreatedIcon from "@spt/assets/icons/scicon.svg";
import TotalIcon from "@spt/assets/icons/totalIcons.svg";
import walleticon from "@spt/assets/icons/wallet-3.svg";
import { type EarningSpoil, useGetEarningsBreakdownQuery } from "@spt/hooks/apiRequests/useGetEarningsBreakdownQuery";
import { useAuthStore } from "@spt/store/authStore";

function SpoilEarningCard({ spoil }: { spoil: EarningSpoil }) {
  return (
    <div className="flex items-stretch gap-3 rounded-xl border-1 border-[#2222220D] bg-white p-4 shadow-sm">
      <div className="relative h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded-[16px] bg-gray-100">
        {spoil.cover_image && (
          <Image
            src={spoil.cover_image}
            alt={spoil.spoil_name}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        <p className="line-clamp-2 md:text-[16px] leading-snug text-[#212529] sm:text-[14px]">
          {spoil.spoil_name}
        </p>
        <div className="flex items-center gap-1 text-[14px] text-[#495057]">
          <Image src={ProfileIcon} alt="profile icon" className="h-[20px] w-[20px] flex-shrink-0 text-[#6B7B8D]" />
          <span>{spoil.total_enrolled} Enrolled</span>
        </div>
        <div className="flex items-center gap-1 text-[14px] text-[#212529]">
          <Image src={walleticon} alt="wallet icon" className="h-[20px] w-[20px] flex-shrink-0 text-[#6B7B8D]" />
          <span>₦{spoil.total_amount?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function EarningsBreakdownPage() {
  const user = useAuthStore((state) => state.user);
  const { earnings, isLoading, isError, errorMessage } = useGetEarningsBreakdownQuery(user?.id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 rounded-full border-4 border-[#0B5368] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500 text-sm py-8">{errorMessage}</p>;
  }


  const spoils = earnings?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-[18px] font-semibold text-[#212529]">
          Earnings Breakdown
        </h2>
        <p className="mt-1 text-[16px] text-[#495057]">
          Track your earnings from all your published Spoylz
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
          <p className="text-[18px] font-semibold text-[#212529]">
            ₦{parseFloat(earnings?.overview?.total_earning ?? "0").toLocaleString()}
          </p>
        </div>

        {/* Spoils Created */}
        <div className="flex flex-col gap-3 rounded-xl border border-[#F9D0B0] bg-[#FEF0E7] px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#F97316]">
              <Image src={CreatedIcon} alt="created icon" className="h-10 w-10 text-white" />
            </div>
            <p className="text-[14px] font-medium text-[#495057]">Spoylz Created</p>
          </div>
          <p className="text-[18px] font-semibold text-[#212529]">
            {earnings?.overview?.spoils_created ?? 0}
          </p>
        </div>
      </div>

      {/* Spoils Earnings Breakdown List */}
      <div>
        <h3 className="mb-4 text-[16px] font-medium text-[#212529]">
          Spoils Earnings Breakdown
        </h3>
        {spoils.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-6">No earnings data available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {spoils.map((spoil, i) => (
              <SpoilEarningCard key={spoil.spoil_name + i} spoil={spoil} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
