"use client";

import { useState } from "react";

import Image from "next/image";

import {
  type SponsorshipDatum,
  useGetSponsorshipsQuery,
} from "@spt/hooks/apiRequests/useGetSponsorshipsQuery";

import { ErrorState } from "../../home/spoilDetails/spoilDetails";
import { LoadingState } from "../../spoil/preSpoilQuiz/components/LoadingState";

import SponsorshipDetailPage from "./SponsorshipDetailPage";

function SponsorshipCard({ item, onClick }: { item: SponsorshipDatum; onClick: () => void }) {
  const coverImage = item.spoil?.cover_image_url;

  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-[12px] border border-[#EEF3F6] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-[115px] w-[117px] flex-shrink-0 overflow-hidden rounded-[16px] sm:h-[80px] sm:w-[80px]">
        {coverImage ? (
          <Image src={coverImage} alt={item.spoil?.title ?? ""} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#F3F4F6] text-[11px] text-[#9CA3AF]">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 pt-1">
        <p className="line-clamp-2 text-[16px] font-medium leading-snug text-[#212529]">
          {item.spoil?.title}
        </p>
        <p className="text-[14px] text-[#6B7B8D]">
          <span className="text-[16px] font-semibold text-[#212529]">N{item.total_amount}</span>{" "}
          {item?.status}
        </p>
        <p className="text-[14px] text-[#666869]">
          {item.total_redeemed} of {item.total_codes} codes used
        </p>
      </div>
    </button>
  );
}

export default function MySponsorshipsPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { sponsorships, isLoading, isError, errorMessage } = useGetSponsorshipsQuery();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={errorMessage} />;

  if (selectedId !== null) {
    return <SponsorshipDetailPage id={selectedId} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="flex flex-col ">
      <div>
        <h2 className="text-[18px] font-semibold text-[#212529]">My Sponsorships</h2>
        <p className="mt-4 text-[16px] text-[#495057]">View and manage all your sponsorships.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {sponsorships &&sponsorships?.map((item) => (
          <SponsorshipCard key={item.id} item={item} onClick={() => setSelectedId(item.id)} />
        ))}
      </div>
    </div>
  );
}
