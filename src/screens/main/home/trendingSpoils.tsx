"use client";

import { motion } from "motion/react";

// import BackTOp from "@spt/assets/icons/button(1).svg";
import Button from "@spt/components/button";
import SpoilCard from "@spt/components/spoilCard";
import Stack from "@spt/components/stack";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetInstitutionSpoilsQuery } from "@spt/hooks/apiRequests/useGetInstitutionSpoilsQuery";


const TrendingSpoil = () => {
  const { data } = useGetInstitutionSpoilsQuery();

  //   const handleScrollTop = () => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // };
  
  return (
    <WebsiteSection className="my-10 w-full">
      <Stack className="gap-8 md:gap-12">
        {/* Title */}
        <motion.h1
          className="text-2xl md:text-4xl  font-semibold text-center text-black self-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Trending Spoils{" "}
        </motion.h1>

        {/* ✅ Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {data?.data?.data?.slice(0, 50)?.map((spoil, index) => (
            <SpoilCard key={index} spoil={spoil} index={index} isInstitution />
          ))}
        </div>
      </Stack>
      <div className="flex justify-center mt-10">
        <Button variant="default" className="rounded-full px-6">
          Explore Spoils
        </Button>
      </div>
      {/* <div onClick={handleScrollTop} className="flex justify-end">
        <Image src={BackTOp} alt="back" width={90} height={80} />
      </div> */}
    </WebsiteSection>
  );
};

export default TrendingSpoil;
