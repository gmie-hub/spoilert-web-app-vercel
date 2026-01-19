"use client";

import React from "react";

import { motion } from "framer-motion";
import Image from "next/image";

import SignUpImage from "@spt/assets/images/auth-image-one.svg";
import { Card } from "@spt/components";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

interface AuthLayoutProps {
  children: React.ReactNode;
  image?: any;
}

const AuthLayout = ({ children, image = SignUpImage }: AuthLayoutProps) => {
  return (
    <section className="w-full min-h-screen overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="
          w-full
          min-h-screen
          bg-white
          flex
          flex-col
          lg:flex-row
        "
      >
        <div className="hidden lg:block w-full flex items-center justify-center my-[3.9rem] px-[2.9rem]">
          <div className="relative w-full h-[calc(100vh-7.8rem)]">
            <Image
              src={image}
              alt="Auth image"
              fill
              priority
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        <div
          className="
            w-full
            min-h-screen
            max-h-screen
            overflow-y-auto
            flex
            items-center
            bg-white
            p-[4.8rem_3.4rem]
          "
        >
          <Card className="w-full max-w-none flex-1 min-w-0">{children}</Card>
        </div>
      </motion.div>
    </section>
  );
};

export default AuthLayout;