"use client";

import { motion } from "motion/react";

import SpoilCard from "@spt/components/spoilCard";
import Stack from "@spt/components/stack";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetMostSubscribedSpoilsQuery } from "@spt/hooks/apiRequests/useGetMostSubscribedSpoilsQuery";

const MostSubscribe = () => {
  const { data, isLoading, isError, errorMessage } = useGetMostSubscribedSpoilsQuery();

  return (
    <WebsiteSection className="py-4 w-full bg-[var(--color-blue)] text-white">
      <Stack>
        {/* Title */}
        <motion.h1
          className="pb-5 text-[28px] md:text-[40px] font-semibold text-center self-center leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Most Subscribed Spoils{" "}
        </motion.h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-4 border-white border-t-transparent animate-spin" />
          </div>
        ) : isError ? (
          <p className="text-center text-white text-sm py-4">{errorMessage}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
            {data?.data?.data?.slice(0, 8).map((spoil, index) => (
              <SpoilCard key={index} spoil={spoil} index={index} isInstitution />
            ))}
          </div>
        )}
      </Stack>
    </WebsiteSection>
  );
};

export default MostSubscribe;
