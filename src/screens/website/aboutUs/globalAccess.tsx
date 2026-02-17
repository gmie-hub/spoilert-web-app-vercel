"use client";

import React from "react";

import Image from "next/image";

import AboutUsImage2 from "@spt/assets/images/about2.svg";
import AboutUsImage from "@spt/assets/images/aboutUs (2).svg";
import GetStarted from "@spt/components/getStarted";

import Difference from "./differece";
import WhySpoilertSection from "./WhySpoilertSection";

export default function AboutSection() {
  return (
    <>
      <section className="px-6 md:px-25 py-4 lg:py-24 bg-white">
        <>
          {/* Top Section: Heading + Image Grid */}
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-20">
            {/* Text */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Global Access to Learning, Teaching, and Earning
              </h2>
              <p className="text-gray-600 text-lg md:text-xl">
                Spoilert bridges the gap between learners and tutors across the
                world. From academic subjects to real-world skills, our platform
                makes it easy to teach, learn, and grow no matter where you are.
              </p>
            </div>
            <div className="flex-1">
              <Image
                src={AboutUsImage}
                alt="Person working on laptop"
                width={590}
                height={200}
              />
            </div>
          </div>

          {/* Bottom Section: Who We Are */}
          <div className="mt-4 sm:mt-16 flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-20">
            {/* Image */}
            <div className="flex-1">
              <Image
                src={AboutUsImage2}
                alt="Person studying"
                width={500}
                height={430}
              />
            </div>

            {/* Text */}
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                Who We Are
              </h3>
              <p className="text-gray-600 text-lg md:text-xl">
                Spoilert is a global learning platform where education meets
                opportunity. We bring together passionate tutors, dedicated
                learners, and institutions creating a vibrant community that
                fosters skill development and knowledge sharing. Spoilert is the
                place to connect, grow, and thrive. At Spoilert, we believe that
                learning should be inclusive, accessible, and rewarding.
              </p>
            </div>
          </div>
          <WhySpoilertSection />
          <Difference />
        </>
      </section>
      <GetStarted />
    </>
  );
}
