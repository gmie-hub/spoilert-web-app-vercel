"use client"

import { motion } from "motion/react";
import Image from "next/image";

import CheckIcon from "@spt/assets/icons/yellow-check.svg";
import CreatingImage from "@spt/assets/images/start-creating.svg";
import Button from "@spt/components/button";
import Flex from "@spt/components/flex";
import HStack from "@spt/components/hstack";
import Stack from "@spt/components/stack";

const ForTutorsTab = () => {
  return (
    <motion.div
      className="bg-yellow-lighter p-6 rounded-lg border border-yellow-dark md:w-4/5"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Flex  direction={{ base: "column", md: "row" }} spacing="gap-8 md:gap-20">
        <motion.div
          className="md:w-[350px] md:h-[340px] w-[295px] h-[318px] flex-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Image
            alt="Learning"
            src={CreatingImage}
            width={295}
            height={318}
            className="md:w-[350px] md:h-[340px] w-full h-full object-contain"
          />
        </motion.div>

        <Stack className="flex-2 gap-6">
          <motion.h2
            className="text-2xl font-semibold text-black"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Earn By Sharing Knowledge
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            As a tutor on Spoilert, you earn continuously, even while you sleep
            by sharing your knowledge and skills with a global audience.
          </motion.p>

          <Stack spacing="gap-6">
            {tutorData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
              >
                <HStack alignItems="center" spacing="gap-2">
                  <Image
                    alt="check"
                    src={CheckIcon}
                    width={20}
                    height={20}
                    className="md:w-[28px] md:h-[28px]"
                  />

                  <p>{item.title}</p>
                </HStack>
              </motion.div>
            ))}
          </Stack>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Button variant="yellow" className="px-12">
              Start Creating Spoils
            </Button>
          </motion.div>
        </Stack>
      </Flex>
    </motion.div>
  );
};

export default ForTutorsTab;

const tutorData = [
  { id: 1, title: "Upload in video or text formats" },
  { id: 2, title: "Organize your content with intuitive categories" },
  { id: 3, title: "Earn continuously with your created spoils" },
];
