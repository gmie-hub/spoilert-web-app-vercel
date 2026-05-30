"use client";

import { motion } from "motion/react";

import Flex from "@spt/components/flex";
import SpoilCard from "@spt/components/spoilCard";
import Stack from "@spt/components/stack";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetAllSpoilsQuery } from "@spt/hooks/apiRequests/useGetAllSpoilsQuery";

const RecommendedSpoils = () => {
  const { data } = useGetAllSpoilsQuery();

  return (
    <WebsiteSection className="w-full">
      <Stack className="gap-6 md:gap-10">
        <motion.h1
          className="text-xl md:text-5xl font-semibold text-center text-black self-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Recommended Spoylz
        </motion.h1>

        <Flex
          justifyContent="start"
          alignItems="stretch"
          direction={{ base: "column", md: "row" }}
          className="gap-4 md:gap-6 w-full"
        >
          {data?.data?.data?.slice(0, 4).map((spoil, index) => (
            <SpoilCard key={index} spoil={spoil} index={index} />
          ))}
        </Flex>
      </Stack>
    </WebsiteSection>
  );
};

export default RecommendedSpoils;
