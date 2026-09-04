"use client";

import React from "react";

import { motion } from "framer-motion";
import Image from "next/image";

import StarIcon from "@spt/assets/icons/star.svg";
import AuthImage from "@spt/assets/images/authImage.png";
import { Card } from "@spt/components";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

interface InstitutionAuthLayoutProps {
  children: React.ReactNode;
}

const InstitutionAuthLayout = ({ children }: InstitutionAuthLayoutProps) => {
  return (
    <section className="w-full lg:min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex min-h-screen w-full flex-col bg-white lg:flex-row"
      >
        <div className="hidden lg:flex lg:w-1/2 lg:p-8 xl:p-10">
          <div className="relative h-full w-full overflow-hidden rounded-[28px]">
            <Image
              src={AuthImage}
              alt="Institution using Spoylz"
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-blue)]/88 via-[var(--color-blue)]/78 to-[var(--color-blue)]/92" />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center xl:px-16">
              <Image
                src={StarIcon}
                alt=""
                width={36}
                height={36}
                className="brightness-0 invert"
              />
              <h2 className="mt-6 max-w-md text-[32px] font-semibold leading-tight tracking-[-0.02em] text-white xl:text-[40px]">
                Spoylz For Institutions
              </h2>
              <p className="mt-4 max-w-[340px] text-[15px] leading-7 text-white/85">
                Join our community of institutions and start providing quality
                education to your students.
              </p>
            </div>
          </div>
        </div>

        <div className="flex min-h-screen w-full flex-col overflow-y-auto bg-white px-5 py-10 sm:px-8 md:py-14 lg:min-h-0 lg:w-1/2 lg:px-12">
          <Card className="mx-auto my-auto w-full min-w-0 max-w-[460px] rounded-[28px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-10">
            {children}
          </Card>
        </div>
      </motion.div>
    </section>
  );
};

export default InstitutionAuthLayout;
