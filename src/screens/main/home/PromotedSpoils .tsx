"use client";

import { motion } from "motion/react";

import PromotedSpoilCard from "@spt/components/PromotedSpoilCard";
import Stack from "@spt/components/stack";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetPublicPromotionsQuery } from "@spt/hooks/apiRequests/useGetPublicPromotionsQuery";

const PromotedSpoils = () => {
  const { activePromotions, isLoading, isError, errorMessage } = useGetPublicPromotionsQuery();

  return (
    <WebsiteSection className="py-4 w-full">
      <Stack>
        {/* Title */}

        <motion.h1
          className="pb-5 text-[28px] md:text-[40px] font-semibold text-center text-black self-center leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Promoted Spoils
        </motion.h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-4 border-[#0B5368] border-t-transparent animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-sm text-red-600">
            {errorMessage || "Failed to load promoted spoils."}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
            {activePromotions.slice(0, 2).map((promotion, index) =>
              promotion.spoil ? (
                <PromotedSpoilCard
                  key={promotion.id}
                  spoil={promotion.spoil as any}
                  index={index}
                />
              ) : null,
            )}
          </div>
        )}
      </Stack>
    </WebsiteSection>
  );
};

export default PromotedSpoils;
