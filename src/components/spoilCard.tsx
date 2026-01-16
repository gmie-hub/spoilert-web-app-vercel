import React from "react";

import { motion } from "motion/react";
import Image from "next/image";

import ArrowRightIcon from "@spt/assets/icons/arrow-right.svg";
import RatingIcon from "@spt/assets/icons/star.svg";
import { SpoilDatum } from "@spt/utils/spoils";

import Button from "./button";
import HStack from "./hstack";
import Stack from "./stack";

interface SpoilCardProps {
  spoil: SpoilDatum;
  onViewSpoil?: (spoil: SpoilDatum) => void;
  index?: number;
  isInstitution?: boolean;
}

const SpoilCard: React.FC<SpoilCardProps> = ({
  spoil,
  onViewSpoil,
  isInstitution,
  index = 0,
}) => {
  const handleViewSpoil = () => {
    onViewSpoil?.(spoil);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex-1 h-full min-w-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Spoil Image */}
      <div className="w-full h-48 overflow-hidden relative">
        <Image
          src={spoil.cover_image_url}
          alt={spoil.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        <Stack spacing="gap-3" className="flex-1">
          <Stack spacing="gap-2">
            {isInstitution && (
              <p className="text-gray-dark text-sm">{spoil?.institution}</p>
            )}
            <h3 className="text-lg font-semibold text-black line-clamp-2">
              {spoil.title}
            </h3>

            <div className="font-semibold text-black">
              ₦
              {spoil.display_amount?.toLocaleString() ||
                spoil.amount?.toLocaleString()}
            </div>
          </Stack>

          <HStack spacing="gap-3" alignItems="center">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden relative">
              {spoil.tutor.avatar ? (
                <Image
                  src={spoil.tutor.avatar}
                  alt={`${spoil.tutor.first_name} ${spoil.tutor.last_name}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium">
                  {spoil.tutor.first_name[0]?.toUpperCase()}
                  {spoil.tutor.last_name[0]?.toUpperCase()}
                </div>
              )}
            </div>

            <span className="text-sm text-gray-700">
              {spoil.tutor.first_name} {spoil.tutor.last_name}
            </span>
          </HStack>

          <HStack spacing="gap-2" alignItems="center" justifyContent="between">
            <span className="inline-block bg-blue-lightest text-blue px-2 py-1 rounded-full text-xs font-medium truncate max-w-[120px]">
              {spoil.category?.name || "Uncategorized"}
            </span>

            <HStack spacing="gap-1" alignItems="center">
              <Image src={RatingIcon} alt="rating" width={20} height={20} />

              <span className="text-sm text-gray-700">
                {spoil.average_rating?.toFixed(1) || "0.0"} (
                {spoil.ratings_count || 0})
              </span>
            </HStack>
          </HStack>

          <Button
            className="w-full"
            onClick={handleViewSpoil}
            iconRight={
              <Image
                src={ArrowRightIcon}
                alt="arrow right"
                width={20}
                height={20}
              />
            }
          >
            View Spoil
          </Button>
        </Stack>
      </div>
    </motion.div>
  );
};

export default SpoilCard;
