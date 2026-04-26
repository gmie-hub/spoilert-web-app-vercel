import React from "react";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import BookmarkIcon from "@spt/assets/icons/fav.svg";
import RatingIcon from "@spt/assets/icons/star.svg";
import useAddBookmarkMutation from "@spt/hooks/apiRequests/useAddBookmarkMutation";
import { SpoilDatum } from "@spt/utils/spoils";

import HStack from "./hstack";
import Stack from "./stack";

interface SpoilCardProps {
  spoil: SpoilDatum;
  onViewSpoil?: (spoil: SpoilDatum) => void;
  index?: number;
  isInstitution?: boolean;
  className?: string; // ✅ allow parent styling
}

const SpoilCard: React.FC<SpoilCardProps> = ({
  spoil,
  onViewSpoil,
  index = 0,
  className = "",
}) => {
  const spoilHref = `/spoil-details/${spoil.id}`;
  const { addBookmark, isLoading: isBookmarking } = useAddBookmarkMutation();

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addBookmark(spoil.id);
  };

  return (
    <Link
      href={spoilHref}
      className="block"
      onClick={() => onViewSpoil?.(spoil)}
    >
      <motion.div
        className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100 cursor-pointer ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: "easeOut",
        }}
        whileHover={{ y: -6 }}
      >
        {/* 🖼 Image */}
        <div className="relative w-full h-[237px] overflow-hidden">
          <Image
            src={spoil?.cover_image_url}
            alt={spoil?.title}
            fill
            className="object-cover"
          />

          {/* ⭐ Bookmark */}
          <button
            type="button"
            onClick={handleBookmark}
            disabled={isBookmarking}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md transition hover:scale-110 disabled:cursor-not-allowed"
          >
            <Image src={BookmarkIcon} alt="bookmark" width={32} height={32} />
          </button>
        </div>

        {/* 📄 Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="text-[18px] font-medium text-[var(--color-black)] line-clamp-2">
            {spoil?.title}
          </h3>

          {/* Price */}
          {spoil?.pricing === "free" ? (
            <p className="text-[18px] font-semibold text-[var(--color-black)]">
              {" "}
              Free{" "}
            </p>
          ) : (
            <p className="text-[18px] font-semibold text-[var(--color-black)]">
              ₦
              {spoil?.display_amount?.toLocaleString() ||
                spoil?.amount?.toLocaleString()}
            </p>
          )}
          {/* Tutor */}
          <HStack spacing="gap-2" alignItems="center">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200">
              {spoil?.tutor?.avatar ? (
                <Image
                  src={spoil?.tutor?.avatar}
                  alt="tutor"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-[10px] font-semibold text-gray-600">
                  {spoil?.tutor?.first_name[0]}
                  {spoil?.tutor?.last_name[0]}
                </span>
              )}
            </div>

            <p className="text-xs  text-[var(--color-gray-dark)] truncate">
              {spoil?.tutor?.first_name} {spoil?.tutor?.last_name}
            </p>
          </HStack>

          {/* Category + Rating */}
          <Stack spacing="gap-2">
            <span className="text-[10px] px-2 py-1 rounded-full text-[var(--color-blue)] bg-[var(--color-blue-lightest)] w-fit">
              {spoil?.category?.name || "Uncategorized"}
            </span>

            <HStack spacing="gap-1" alignItems="center">
              <Image src={RatingIcon} alt="rating" width={20} height={20} />
              <p className="text-[1wpx] text-[var(--color-black-dark)] ">
                {spoil?.average_rating?.toFixed(1) || "0.0"} (
                {spoil?.ratings_count || 0})
              </p>
            </HStack>
          </Stack>
        </div>
      </motion.div>
    </Link>
  );
};

export default SpoilCard;
