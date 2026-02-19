"use client";

import { motion } from "motion/react";

import PromotedSpoilCard from "@spt/components/PromotedSpoilCard";
import Stack from "@spt/components/stack";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetInstitutionSpoilsQuery } from "@spt/hooks/apiRequests/useGetInstitutionSpoilsQuery";

const PromotedSpoils = () => {
  const { data } = useGetInstitutionSpoilsQuery();

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

        {/* Cards */}

        {/* <div className="grid grid-cols-2 gap-4 w-full"> */}
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-5 w-full">
          {data?.data?.data?.slice(0, 2).map((spoil, index) => (
            <PromotedSpoilCard key={spoil.id} spoil={spoil} index={index} />
          ))}
        </div>
      </Stack>
    </WebsiteSection>
  );
};

export default PromotedSpoils;
