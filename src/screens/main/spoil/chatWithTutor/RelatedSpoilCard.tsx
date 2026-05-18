import Image from "next/image";
import { FiShare2, FiStar, FiThumbsUp, FiUsers } from "react-icons/fi";

import type { SpoilDetailsData } from "@spt/utils/spoils.d";

export type RelatedSpoilItem = SpoilDetailsData["related_spoils"][number];

export function RelatedSpoilCard({ spoil }: { spoil: RelatedSpoilItem }) {
  const isFreeSpoil = !spoil.display_amount || spoil.display_amount === 0;
  const price = isFreeSpoil ? "Free" : `₦${spoil.display_amount.toLocaleString()}`;

  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden hover:shadow-sm transition-shadow">
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        {spoil.cover_image_url ? (
          <Image src={spoil.cover_image_url} alt={spoil.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-[#E8EEF2]" />
        )}
      </div>

      <div className="p-2.5">
        <p className="text-xs font-semibold text-[#20262D] line-clamp-2 leading-snug mb-1">
          {spoil.title}
        </p>
        <p className="text-xs font-bold text-[#20262D] mb-1.5">{price}</p>

        {spoil.category && (
          <span className="inline-block px-2 py-0.5 rounded-md bg-[#EEF7FB] text-[#0B5368] text-[10px] font-medium mb-1.5">
            {spoil.category.name}
          </span>
        )}

        {spoil.average_rating != null && (
          <div className="flex items-center gap-1 text-[10px] text-[#6B7280]">
            <FiStar size={10} className="text-yellow-400 fill-yellow-400" />
            <span>{spoil.average_rating.toFixed(1)}</span>
            <span>({spoil.ratings_count})</span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#8A98A3]">
          <span className="flex items-center gap-0.5"><FiThumbsUp size={9} /> {spoil.likes_count}</span>
          <span className="flex items-center gap-0.5"><FiShare2 size={9} /> {spoil.shares_count}</span>
          <span className="flex items-center gap-0.5"><FiUsers size={9} /> {spoil.enrolled_users}</span>
        </div>
      </div>
    </div>
  );
}
