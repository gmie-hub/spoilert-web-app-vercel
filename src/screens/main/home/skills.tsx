"use client";

import { motion } from "motion/react";

import SpoilCard from "@spt/components/spoilCard";
import Stack from "@spt/components/stack";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetInstitutionSpoilsQuery } from "@spt/hooks/apiRequests/useGetInstitutionSpoilsQuery";

const SkillPage = () => {
  const { data } = useGetInstitutionSpoilsQuery();

  return (
    <WebsiteSection className="py-4 w-full bg-[#F4FCFF]">
      <Stack>
        {/* Title */}
        <motion.h1
          className="pb-5 text-[28px] md:text-[40px] font-semibold text-center text-black self-center leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Skill Acquisition Spoils
        </motion.h1>

        {/* ✅ Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {data?.data?.data?.slice(0, 8).map((spoil, index) => (
            <SpoilCard key={index} spoil={spoil} index={index} isInstitution />
          ))}
        </div>
      </Stack>
    </WebsiteSection>
  );
};

export default SkillPage;
