"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import GlobalImage from "@spt/assets/images/global.svg";
import Button from "@spt/components/button";
import Stack from "@spt/components/stack";
import WebsiteSection from "@spt/components/websiteSection";

const GlobalCommunity = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <WebsiteSection className="bg-[#FBFBFB]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex w-full justify-between items-center flex-col md:flex-row"
      >
        <motion.div variants={childVariants} className="flex-1">
          <Stack className="">
            <h1 className="text-2xl md:text-4xl font-bold text-black leading-10 md:leading-16">
              A Global Community of Learners and Tutors
            </h1>

            <p>
              With Spoilert, learning has no borders. It empowers learners and
              tutors from all Countries to connect, share, and learn. Our global
              community thrives on collaboration, knowledge exchange, and the
              collective desire to learn and teach beyond borders.{" "}
            </p>

            <div>
              <Button className="px-10">Get Started</Button>
            </div>
          </Stack>
        </motion.div>

        <motion.div
          variants={childVariants}
          className="flex-1"
          whileHover={{ scale: 1.05 }}
        >
          <div className="">
            <Image
              src={GlobalImage}
              alt="global"
              width={327}
              height={327}
              className="md:w-[486px] md:h-[486px]"
            />
          </div>
        </motion.div>
      </motion.div>
    </WebsiteSection>
  );
};

export default GlobalCommunity;
