"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import LearnersIcon from "@spt/assets/icons/learners.svg";
import TutorsIcon from "@spt/assets/icons/tutors.svg";
import LearnersTutorsImage from "@spt/assets/images/learners-tutors.svg";
import Flex from "@spt/components/flex";
import Stack from "@spt/components/stack";
import WebsiteSection from "@spt/components/websiteSection";

const LearningPlatform = () => {
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const learnersTutorsData = [
    {
      icon: LearnersIcon,
      title: "Learners",
      description:
        "Access expertly designed spoils in video and text formats, browse through categories, whether it’s acing your exams, upskilling, or discovering something new, Spoilert is here for you.",
    },
    {
      icon: TutorsIcon,
      title: "Tutors",
      description:
        "Whether you are a lecturer of an institution, a mentor, or you’re teaching exam prep, professional skills, or passion projects, Spoilert gives you the tools to design and deliver content on your own schedule, reach learners globally, and earn without limits. ",
    },
  ];

  return (
    <WebsiteSection className="bg-white-light">
      <Stack className="w-full gap-12">
        <Stack className="w-full" alignItems="center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xl md:text-4xl text-black font-semibold text-center"
          >
            A Learning Platform That Works For Everyone
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:text-2xl text-center"
          >
            Whether you&apos;re here to learn or teach, Spoilert empowers you to do
            more.
          </motion.p>
        </Stack>

        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent="center"
          className="md:gap-[137px]"
          alignItems="center"
        >
          <motion.div
            variants={childVariants}
            className="flex-1"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={LearnersTutorsImage}
              alt="Learners and Tutors"
              layout="responsive"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          <Stack className="flex-2">
            {learnersTutorsData.map((item, index) => (
              <motion.div
                key={index}
                className="flex-1"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Stack>
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={50}
                    height={50}
                  />

                  <div>
                    <h3 className="md:text-2xl text-black font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </Stack>
              </motion.div>
            ))}
          </Stack>
        </Flex>
      </Stack>
    </WebsiteSection>
  );
};

export default LearningPlatform;
