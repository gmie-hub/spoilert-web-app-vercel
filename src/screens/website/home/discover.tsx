"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import DiscoverImage from "@spt/assets/icons/discover-spoil.svg";
import Button from "@spt/components/button";
import Flex from "@spt/components/flex";
import Stack from "@spt/components/stack";

const Discover = () => {
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
    <section className="px-8 py-6 md:px-[100px] md:py-[72px]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex w-full justify-between items-center flex-col md:flex-row"
      >
        <motion.div variants={childVariants} className="flex-1">
          <Stack className="flex-1">
            <p className="text-2xl md:text-4xl font-bold text-black leading-10 md:leading-16">
              Empowering <span className="text-yellow">Global</span> <br />{" "}
              <span className="text-yellow">
                Education. <span className="text-black">Learn, Teach ,</span>
              </span> <br />
              and <span className="text-yellow">Earn Money</span>
            </p>

            <p className="md:text-2xl">
              Discover a world of knowledge and skill acquisition from leading
              experts and reputable institutions around the world.
            </p>

            <Flex direction={{ base: "column", md: "row" }}>
              <Button className="px-10">Download App</Button>
              <Button className="px-10" variant="outline">Get Started</Button>
            </Flex>
          </Stack>
        </motion.div>

        <motion.div
          variants={childVariants}
          className="flex-1"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex-1">
            <Image
              src={DiscoverImage}
              alt="Discover"
              layout="responsive"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Discover;
