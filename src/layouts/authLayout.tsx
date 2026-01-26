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
    <section className="w-full lg:h-screen lg:overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full min-h-screen lg:min-h-full lg:h-full bg-white flex flex-col lg:flex-row"
      >
        {/* Left Image Section */}
        <div className="hidden lg:flex w-1/2 items-center justify-center py-12 ps-12">
          <div className="relative w-full h-full">
            <Image
              src={image}
              alt="Auth image"
              fill
              priority
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Right Content Section */}
        <div className="w-full lg:w-1/2 min-h-screen lg:min-h-0 flex flex-col bg-white p-8 md:py-16 overflow-y-auto">
          <Card className="w-full min-w-0 my-auto flex-1">{children}</Card>
        </div>
      </motion.div>
    </section>
  );
};

export default AuthLayout;
