"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import WebsiteSection from "@spt/components/websiteSection";
import { useGetInstitutionSpoilsQuery } from "@spt/hooks/apiRequests/useGetInstitutionSpoilsQuery";
// eslint-disable-next-line import/order
import HStack from "@spt/components/hstack";

const SelfDev = () => {
  const router = useRouter();
  const { data } = useGetInstitutionSpoilsQuery();

  // Get first 6 spoils
  const spoils = data?.data?.data?.slice(0, 6) || [];

  // Split into 2 columns
  const leftSpoils = spoils.slice(0, 3);
  const rightSpoils = spoils.slice(3, 6);

  return (
    <WebsiteSection className="w-full bg-[#014751] py-10 md:py-14">
      {/* Title */}
      <motion.h1
        className="text-2xl md:text-4xl font-bold text-center text-white mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Spoils For Self Development
      </motion.h1>

      {/* Main Layout */}
      <div className="w-full px-4 sm:px-6 md:px-8">
        {/* ✅ Two White Column Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
          {/* LEFT COLUMN */}
          <div className="bg-[var(--color-blue-lightest)] rounded-2xl p-4 sm:p-6 space-y-5 shadow-lg">
            {leftSpoils.map((spoil, index) => (
              <div
                key={spoil.id}
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                onClick={() => router.push(`/spoil-details/${spoil.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") router.push(`/spoil-details/${spoil.id}`);
                }}
              >
                <SpoilCard spoil={spoil} index={index} />
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN */}
          <div className="bg-[var(--color-blue-lightest)] rounded-2xl p-4 sm:p-6 space-y-5 shadow-lg">
            {rightSpoils.map((spoil, index) => (
              <div
                key={spoil.id}
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                onClick={() => router.push(`/spoil-details/${spoil.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") router.push(`/spoil-details/${spoil.id}`);
                }}
              >
                <SpoilCard
                  className="bg[#EFFCFF]"
                  spoil={spoil}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </WebsiteSection>
  );
};

/* ✅ Small Card Component (Exactly Like Screenshot) */
const SpoilCard = ({ spoil, index }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#EFFCFF] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-44 sm:w-[139px] sm:h-[124px] rounded-lg overflow-hidden flex-shrink-0">
        <Image src={spoil.cover_image_url} alt={spoil.title} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Title */}
        <h2 className="font-semibold text-sm sm:text-base text-[#03363b] line-clamp-2">{spoil.title}</h2>

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
            {spoil.tutor.avatar ? (
              <Image
                src={spoil.tutor.avatar}
                alt="tutor"
                fill
                className="object-cover"
              />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-[10px] font-semibold text-gray-600">
                {spoil.tutor.first_name[0]}
                {spoil.tutor.last_name[0]}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[var(--color-gray-dark)] truncate">
            {spoil.tutor.first_name} {spoil.tutor.last_name}
          </p>
        </HStack>

        {/* Category */}
        {spoil.category?.name && (
          <span className="inline-block mt-2 text-xs sm:text-sm px-2 py-1 rounded-full bg-[#dff6f7] text-[#0b595b]">
            {spoil.category.name}
          </span>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2 text-yellow-500 text-xs">
          ⭐ {spoil.average_rating?.toFixed(1) || "0.0"}
        </div>
      </div>
    </motion.div>
  );
};

export default SelfDev;
