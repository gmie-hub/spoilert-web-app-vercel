"use client";

import { motion } from "motion/react";
import Image from "next/image";

import LearningIcon from "@spt/assets/icons/learning.svg";
import SpoilFormatIcon from "@spt/assets/icons/spoil-format.svg";
import SponsorLearningIcon from "@spt/assets/icons/sponsor-learning.svg";
import TopTutorsIcon from "@spt/assets/icons/top-tutors.svg";
import Stack from "@spt/components/stack";
import WebsiteSection from "@spt/components/websiteSection";

const WhyWeAreDifferent = () => {
  return (
    <WebsiteSection className="">
      <Stack className="gap-6 md:gap-10">
        <motion.h1
          className="text-xl md:text-5xl font-semibold text-center text-black self-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why We Are Different
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.map((item, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl border-16 hover:shadow-lg transition-shadow duration-300 ${item.className}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Stack>
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={40}
                  height={40}
                  className="md:w-[50px] md:h-[50px]"
                />

                <h2 className="md:text-2xl font-semibold">{item.title}</h2>

                <p>{item.description}</p>
              </Stack>
            </motion.div>
          ))}
        </div>
      </Stack>
    </WebsiteSection>
  );
};

export default WhyWeAreDifferent;

const data = [
  {
    icon: SpoilFormatIcon,
    title: "Multiple Spoil Formats",
    className: "border-blue-lighter bg-blue-lightest",
    description:
      'Our learning materials referred to as "Spoils" are available in video and text formats, giving you the flexibility to learn anywhere at anytime, in the way that works best for you.',
  },
  {
    icon: LearningIcon,
    title: "Self Paced Learning",
    className: "border-yellow-light bg-yellow-lighter",
    description:
      "No pressure. With Spoilert, you decide when, where, and how you learn. Dive into spoils at your own pace, pause when you need to, and resume when you're ready. ",
  },
  {
    icon: TopTutorsIcon,
    title: "Learn from Top Tutors and Institutions",
    className: "border-yellow-light bg-yellow-lighter",
    description:
      "Gain exclusive access to world-class knowledge, skills, and insights from leading experts, industry professionals, and top educational institutions. ",
  },
  {
    icon: SponsorLearningIcon,
    title: "Support Learning with Sponsorships",
    className: "border-blue-lighter bg-blue-lightest",
    description:
      "Support learners by sponsoring a spoil and providing access to valuable knowledge. You can also get your own spoils sponsored, so more learners can benefit. It’s learning made possible by you.",
  },
];