"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import useGetPromotionsQuery from "@spt/hooks/apiRequests/useGetPromotionsQuery";

import { ErrorState } from "../../home/spoilDetails/spoilDetails";
import { LoadingState } from "../../spoil/preSpoilQuiz/components/LoadingState";

function formatTimeLeft(endDate: string): string {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${days}d:${hours}h:${minutes}m:${seconds}s left`;
}

function formatAmount(amount: string): string {
  const num = parseFloat(amount);
  return `₦${num.toLocaleString("en-NG")}`;
}

function PromotionCard({ image, institution, title, price, tag, timeLeft }: {
  image: string;
  institution: string;
  title: string;
  price: string;
  tag: string;
  timeLeft: string;
}) {
  return (
    <div className="flex bg-white rounded-[12px] shadow-[#1E1E1E12] px-3 py-4 gap-2 items-center relative group hover:shadow-md transition border border-[#F6F4F0]">
      <div className="w-24 h-24 rounded-[16px] overflow-hidden flex-shrink-0">
        {image ? (
          <Image
            src={image}
            alt={title}
            width={100}
            height={115}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-[#E3F5FA]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        {institution && <div className="text-[14px] text-[#666869] font-medium mb-1">{institution}</div>}
        <div className="font-semibold text-[16px] text-[#212529] truncate pr-2 leading-snug">{title}</div>
        <div className="flex items-center gap-5 mt-1">
          <span className="text-[#212529] font-semibold text-[16px]">{price}</span>
          {tag && <span className="bg-[#E3F5FA] text-[#013B4D] text-[12px] font-medium rounded-[8px] px-2 py-0.5">{tag}</span>}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[12px] text-[#212529]">{timeLeft}</span>
        </div>
      </div>
    </div>
  );
}

export default function MyPromotionsPage() {
  const [tab, setTab] = useState<'active' | 'expired'>('active');
  const router = useRouter();
  const { activePromotions, expiredPromotions, isLoading, isError, errorMessage } = useGetPromotionsQuery();

  const currentList = tab === 'active' ? activePromotions : expiredPromotions;

  return (
    <div className="p-6">
      <h2 className="text-[18px] font-semibold mb-6 text-[#212529]">My Promotions</h2>
      <div className="flex gap-0 border-b border-[#E9EEF2] mb-6 relative w-full max-w-5xl mx-auto">
        <button
          className={`flex-1 pb-2 text-[16px] font-semibold transition border-b-2 ${tab === 'active' ? 'border-[#013B4D] text-[#013B4D]' : 'border-transparent text-[#666869]'}`}
          onClick={() => setTab('active')}
        >
          Active
        </button>
        <button
          className={`flex-1 pb-2 text-[16px] font-semibold transition border-b-2 ${tab === 'expired' ? 'border-[#013B4D] text-[#013B4D]' : 'border-transparent text-[#666869]'}`}
          onClick={() => setTab('expired')}
        >
          Expired
        </button>
      </div>
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message={errorMessage} />
      ) : currentList.length === 0 ? (
        <p className="text-center text-sm text-[#666869] py-10">No {tab} promotions</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentList.map((promo) => (
            <div key={promo.id} onClick={() => router.push(`/profile/my-promotions/details?id=${promo.id}`)} className="cursor-pointer">
              <PromotionCard
                image={promo.spoil?.cover_image_url ?? ""}
                institution={promo.spoil?.institution?.name ?? ""}
                title={promo.spoil?.title ?? ""}
                price={formatAmount(promo.amount)}
                tag={promo.spoil?.category?.name ?? ""}
                timeLeft={formatTimeLeft(promo.end_date)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
