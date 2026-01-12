import React from "react";

import Image from "next/image";

import RatingIcon from "@spt/assets/icons/star.svg";
import { SpoilDatum } from "@spt/utils/spoils";

import Button from "./button";
import HStack from "./hstack";
import Stack from "./stack";

interface SpoilCardProps {
  spoil: SpoilDatum;
  onViewSpoil?: (spoil: SpoilDatum) => void;
}

const SpoilCard: React.FC<SpoilCardProps> = ({ spoil, onViewSpoil }) => {
  const handleViewSpoil = () => {
    onViewSpoil?.(spoil);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Spoil Image */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={spoil.cover_image_url}
          alt={spoil.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="p-4">
        <Stack spacing="gap-3">
          {/* Spoil Name */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {spoil.title}
          </h3>

          {/* Amount */}
          <div className="text-xl font-bold text-blue-600">
            ₦
            {spoil.display_amount?.toLocaleString() ||
              spoil.amount?.toLocaleString()}
          </div>

          {/* Tutor Info */}
          <HStack spacing="gap-3" alignItems="center">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
              {spoil.tutor.avatar ? (
                <img
                  src={spoil.tutor.avatar}
                  alt={`${spoil.tutor.first_name} ${spoil.tutor.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium">
                  {spoil.tutor.first_name[0]}
                  {spoil.tutor.last_name[0]}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-700">
              {spoil.tutor.first_name} {spoil.tutor.last_name}
            </span>
          </HStack>

          {/* Category, Rating, and Review */}
          <HStack spacing="gap-2" alignItems="center" justifyContent="between">
            {/* Category Tag */}
            <span className="inline-block bg-yellow-lighter text-yellow px-2 py-1 rounded-full text-xs font-medium">
              {spoil.category?.name || "Uncategorized"}
            </span>

            {/* Rating */}
            <HStack spacing="gap-1" alignItems="center">
              <Image src={RatingIcon} alt="rating" width={20} height={20} />

              <span className="text-sm text-gray-700">
                {spoil.average_rating?.toFixed(1) || "0.0"} (
                {spoil.ratings_count || 0})
              </span>
            </HStack>
          </HStack>

          {/* View Spoil Button */}
          <Button className="w-full" onClick={handleViewSpoil}>
            View Spoil
          </Button>
        </Stack>
      </div>
    </div>
  );
};

export default SpoilCard;
