"use client";

import React from "react";

import { motion } from "motion/react";
import Image from "next/image";
import ThumbUp from "@spt/assets/icons/vuesax.svg";

import ArrowIcon from "@spt/assets/icons/arrow-right-icon.svg";
import { SpoilDatum } from "@spt/utils/spoils";

import Button from "./button";

interface Props {
  spoil: SpoilDatum;
  index?: number;
}

const PromotedSpoilCard: React.FC<Props> = ({ spoil, index = 0 }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-[0px_4px_40px_0px_#1E1E1E12] border border-gray-100 overflow-hidden w-full items-stretch "
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -6 }}
    >
      {/* Top Content */}
      <div className="p-4 space-y-3">
        {/* Tutor + Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
              {spoil.tutor.avatar ? (
                <Image
                  src={spoil.tutor.avatar}
                  alt="tutor"
                  // fill
                  className="object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                <span className="text-xs font-semibold flex items-center justify-center w-full h-full text-gray-600">
                  {spoil.tutor.first_name[0]}
                  {spoil.tutor.last_name[0]}
                </span>
              )}
            </div>

            <p className="text-sm font-medium text-[var(--color-blue)]  ">
              {spoil.tutor.first_name} {spoil.tutor.last_name}
            </p>
          </div>

          {/* Promoted Badge */}
          <span className="text-[11px] px-3 py-1 rounded-full bg-[var(--color-yellow-lighter)] text-orange-500 font-medium">
            Promoted
          </span>
        </div>

        {/* Institution */}
        {spoil.institution && (
          <p className="text-xs font-medium  text-[var(--color-black)]">
            {spoil.institution}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-[var(--color-black)]">
          {spoil.title}
        </h3>

        {/* Price + Category */}
        <div className="flex items-center justify-between  text-[var(--color-black)]">
          <p className="text-sm font-bold text-gray-900">
            ₦{spoil.display_amount?.toLocaleString()}
          </p>

          <span className="text-[11px]  rounded-full bg-[var(--color-blue-lightest)]   text-[var(--color-blue)]">
            {spoil.category?.name || "Category"}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--color-gray-dark)] leading-relaxed line-clamp-3 ">
          {spoil.description ||
            "Understanding Design Principles is a comprehensive Spoil that takes you through the foundational concepts..."}
        </p>
      </div>

      {/* Image Preview */}
      <div className="relative h-[230px] mx-4 mb-4 ">
        <Image
          src={spoil.cover_image_url}
          alt={spoil.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[var(--color-blue-lightest)]">
        {/* Likes */}
        <div className="flex items-center gap-1 text-[var(--color-black)] text-xm">
          <Image src={ThumbUp} alt="ThumbUp" width={16} height={16} />
          <span>{spoil.ratings_count || 20}</span>
        </div>

        <Button
          iconRight={
            <Image src={ArrowIcon} alt="arrow" width={16} height={16} />
          }
          variant="blueOutline"
          type="submit"
        >
          View More
        </Button>
      </div>
    </motion.div>
  );
};

export default PromotedSpoilCard;
