"use client"

import { motion } from "motion/react";

import HStack from "@spt/components/hstack";
import Stack from "@spt/components/stack";
import Tabs from "@spt/components/tabs";

import ForLearnersTab from "./tabs/forLearners";
import ForTutorsTab from "./tabs/forTutors";

const WhatSpoilertOffers = () => {
  const tabs = [
    { label: "For Learners", content: <ForLearnersTab /> },
    { label: "For Tutors", content: <ForTutorsTab /> },
  ];

  return (
    <section>
      <Stack className="gap-6 md:gap-10">
        <motion.h1
          className="text-xl md:text-5xl font-semibold text-center text-black self-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why We Are Different
        </motion.h1>

        <HStack justifyContent="center" className="mb-8">
          <Tabs tabs={tabs} />
        </HStack>
      </Stack>
    </section>
  );
};

export default WhatSpoilertOffers;
