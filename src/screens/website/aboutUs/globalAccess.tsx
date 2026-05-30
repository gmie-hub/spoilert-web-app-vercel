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
                SPOILERT is a modern multi-platform learning solution designed
                to bridge the gap between knowledge providers and learners
                across the world. We believe that knowledge should be
                accessible, flexible, and interactive. SPOILERT empowers
                individuals to share their expertise by creating structured
                courses—called Spoylz—while enabling learners to access
                high-quality educational content in formats that suit their
                needs. Our platform supports both live learning experiences and
                self-paced education, allowing users to learn anytime, anywhere.
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
                A seamless learning experience across mobile apps and web
                platforms A marketplace where tutors can create and monetize
                courses Interactive features such as group communities, chats,
                and live sessions A diverse range of subjects and categories
                tailored to global users
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
