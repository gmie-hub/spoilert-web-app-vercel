"use client";

import React, { ReactNode } from "react";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import Button from "@spt/components/button";
import Stack from "@spt/components/stack";

interface SuccessStateProps {
  title: string;
  description?: ReactNode;
  buttonLabel: string;
  href?: string;
  onButtonClick?: () => void;
  icon?: string;
  className?: string;
}

export const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};


const SuccessState = ({
  title,
  description,
  buttonLabel,
  href,
  onButtonClick,
  icon,
}: SuccessStateProps) => {
  return (
    <main className="w-full max-w-none text-center ">
      <Stack className="w-full max-w-none space-y-2 ">
        <motion.div
          variants={childVariants}
          className="flex justify-center items-center w-full"
          whileHover={{ scale: 1.05 }}
        >
          <Image
            src={icon || ""}
            alt="icon"
            width={200}
            height={36}
            className="md:w-[200px]  md:h-[200px]"
          />
        </motion.div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900  mx-auto text-center">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-sm sm:text-md text-gray-500 max-w-sm mx-auto">
            {description}
          </p>
        )}

        {/* CTA */}
        {href ? (
          <Link href={href} className="w-full">
            <Button className="w-full">{buttonLabel}</Button>
          </Link>
        ) : (
          <Button className="w-full" onClick={onButtonClick}>
            {buttonLabel}
          </Button>
        )}
      </Stack>
    </main>
  );
};

export default SuccessState;
