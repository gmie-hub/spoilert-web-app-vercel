"use client";

import React from "react";

import { motion } from "motion/react";
import Image from "next/image";

import WebsiteSection from "@spt/components/websiteSection";
import { useGetInstitutionSpoilsQuery } from "@spt/hooks/apiRequests/useGetInstitutionSpoilsQuery";

const RelatedSpoil = () => {
  const { data } = useGetInstitutionSpoilsQuery();
  const spoils = data?.data?.data?.slice(0, 6) || [];

  return (
    <WebsiteSection className="my-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Related Spoils</h3>
        <a className="text-sm text-[var(--color-blue)]">See All &gt;</a>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 w-max">
          {spoils.map((spoil: any, idx: number) => (
            <motion.div
              key={spoil.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="w-80 bg-white rounded-xl shadow-md flex-shrink-0 p-3 flex gap-3 items-start"
            >
              <div className="relative w-24 h-20 rounded-md overflow-hidden flex-shrink-0">
                {spoil.cover_image_url ? (
                  <Image src={spoil.cover_image_url} alt={spoil.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}

                <div className="absolute top-2 left-2 bg-white rounded-full p-1 shadow">
                  <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12h.01M12 12h.01M18 12h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-semibold line-clamp-2">{spoil.title}</h4>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600">Free</span>
                  <span className="text-xs text-gray-500">{spoil.category?.name || 'Uncategorized'}</span>
                </div>

                <div className="mt-3 flex items-center gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span>{(spoil.average_rating || 0).toFixed(1)}</span>
                    <span className="text-gray-400">({spoil.ratings_count || 0})</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </WebsiteSection>
  );
};

export default RelatedSpoil;
