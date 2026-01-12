"use client";

import { motion } from "motion/react";

import HStack from "@spt/components/hstack";
import SpoilCard from "@spt/components/spoilCard";
import Stack from "@spt/components/stack";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetInstitutionSpoilsQuery } from "@spt/hooks/apiRequests/useGetInstitutionSpoilsQuery";

const InstitutionSpoils = () => {
  const { data } = useGetInstitutionSpoilsQuery();

  return (
    <WebsiteSection className="my-4">
      <Stack className="gap-6 md:gap-10">
        <motion.h1
          className="text-xl md:text-5xl font-semibold text-center text-black self-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Institution Spoils
        </motion.h1>

        <HStack>
          {data?.data?.data?.slice(0, 4).map((spoil, index) => (
            <SpoilCard key={index} spoil={spoil} />
          ))}
        </HStack>
      </Stack>
    </WebsiteSection>
  );
};

export default InstitutionSpoils;
