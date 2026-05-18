"use client";

import { motion } from "motion/react";

import Flex from "@spt/components/flex";
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
          Institution Spoils
        </motion.h1>

        <Flex
          justifyContent="start"
          alignItems="stretch"
          direction={{ base: "column", md: "row" }}
          className="gap-4 md:gap-6 w-full"
        >
          {isLoading ? (
            <div className="flex justify-center py-12 w-full">
              <div className="w-8 h-8 rounded-full border-4 border-[#0B5368] border-t-transparent animate-spin" />
            </div>
          ) : isError ? (
            <p className="text-center text-red-500 text-sm py-4 w-full">{errorMessage}</p>
          ) : (
            data?.data?.data?.slice(0, 4).map((spoil, index) => (
              <SpoilCard key={index} spoil={spoil} index={index} isInstitution />
            ))
          )}
        </Flex>
      </Stack>
    </WebsiteSection>
  );
};

export default InstitutionSpoils;
