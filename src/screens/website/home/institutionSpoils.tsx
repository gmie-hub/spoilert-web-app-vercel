"use client";

import { motion } from "motion/react";

import SpoilCard from "@spt/components/spoilCard";
import Stack from "@spt/components/stack";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetInstitutionSpoilsQuery } from "@spt/hooks/apiRequests/useGetInstitutionSpoilsQuery";

const InstitutionSpoils = () => {
  const { data, isLoading, isError, errorMessage } = useGetInstitutionSpoilsQuery();

  return (
    <WebsiteSection className="my-4 w-full">
      <Stack className="gap-6 md:gap-10">
        <motion.h1
          className="text-xl md:text-5xl font-semibold text-center text-black self-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Institution Spoylz
        </motion.h1>

        {/* 1 card per row on sm/md, 2 per row from lg upward */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12 w-full">
              <div className="w-8 h-8 rounded-full border-4 border-[#0B5368] border-t-transparent animate-spin" />
            </div>
          ) : isError ? (
            <p className="col-span-full text-center text-red-500 text-sm py-4 w-full">{errorMessage}</p>
          ) : (
            data?.data?.data?.slice(0, 4).map((spoil, index) => (
              <SpoilCard key={index} spoil={spoil} index={index} isInstitution />
            ))
          )}
        </div>
      </Stack>
    </WebsiteSection>
  );
};

export default InstitutionSpoils;
