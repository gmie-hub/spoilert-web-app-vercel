"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";

// import BackTOp from "@spt/assets/icons/button(1).svg";
import Button from "@spt/components/button";
import SpoilCard from "@spt/components/spoilCard";
import Stack from "@spt/components/stack";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetInstitutionSpoilsQuery } from "@spt/hooks/apiRequests/useGetInstitutionSpoilsQuery";


const TrendingSpoil = () => {
  const router = useRouter();
  const { data, isLoading, isError, errorMessage } =
    useGetInstitutionSpoilsQuery({ trending: true });

  return (
    <WebsiteSection className="my-10 w-full">
      <Stack className="gap-8 md:gap-12">
        <motion.h1
          className="text-2xl md:text-4xl font-semibold text-center text-black self-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Trending Spoils
        </motion.h1>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-4 border-[#0B5368] border-t-transparent animate-spin" />
          </div>
        )}

        {isError && !isLoading && (
          <p className="text-center text-red-500 text-sm">{errorMessage}</p>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {data?.data?.data?.slice(0, 50)?.map((spoil, index) => (
              <div
                key={spoil.id ?? index}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/spoil-details/${spoil.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    router.push(`/spoil-details/${spoil.id}`);
                }}
                className="cursor-pointer"
              >
                <SpoilCard spoil={spoil} index={index} isInstitution />
              </div>
            ))}
          </div>
        )}
      </Stack>

      <div className="flex justify-center mt-10">
        <Button variant="default" className="rounded-full px-6">
          Explore Spoils
        </Button>
      </div>
    </WebsiteSection>
  );
};

export default TrendingSpoil;
