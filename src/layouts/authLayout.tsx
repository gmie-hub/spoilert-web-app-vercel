"use client";

import React from "react";

import { motion } from "framer-motion";
import Image from "next/image";

import SignUpImage from "@spt/assets/images/authImage.png";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface AuthLayoutProps {
  children: React.ReactNode;
  image?: any;
}

const AuthLayout = ({ children, image = SignUpImage }: AuthLayoutProps) => {
  return (
    <section className="min-h-screen flex items-center">
      <div className="relative flex flex-col items-center w-full">
        {/* Main card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="
            relative
            w-full
            rounded-[12.8px]
            px-6 py-10
            md:px-16 md:py-14
            flex flex-col lg:flex-row items-stretch
            gap-12
          "
        >
          {/* LEFT IMAGE */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:flex lg:basis-1/2 items-center justify-center h-full max-h-[100vh]"
          >
            <div className="w-full h-full overflow-hidden rounded-[12px]">
              <Image
                src={image}
                alt="Auth visual"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* RIGHT CONTENT */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:basis-1/2 max-w-md mx-auto"
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AuthLayout;
