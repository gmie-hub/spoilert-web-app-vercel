"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import BookedmarkIcon from "@spt/assets/icons/booked.svg";
import BookmarkIcon from "@spt/assets/icons/fav.svg";
import RatingIcon from "@spt/assets/icons/star.svg";
import HStack from "@spt/components/hstack";
import WebsiteSection from "@spt/components/websiteSection";
import useAddBookmarkMutation from "@spt/hooks/apiRequests/useAddBookmarkMutation";
import { useGetInstitutionSpoilsQuery } from "@spt/hooks/apiRequests/useGetInstitutionSpoilsQuery";

const InstitutionSpoils = () => {
  const router = useRouter();
  const { data, isLoading, isError, errorMessage } = useGetInstitutionSpoilsQuery({
    is_institution: true,
  });
  const { addBookmark, isLoading: isBookmarking } = useAddBookmarkMutation();

  return (
    <>{data?.data?.data && data?.data?.data?.length > 0 && (
    <WebsiteSection className="py-4 w-full">
      <motion.h1
        className="pb-5 text-[28px] md:text-[40px] font-semibold text-center text-black self-center leading-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Institution Spoylz
      </motion.h1>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-4 border-[#0B5368] border-t-transparent animate-spin" />
        </div>
      )}

      {isError && !isLoading && (
        <p className="text-center text-red-500 text-sm py-4">{errorMessage}</p>
      )}

      {/* 1 card per row on sm/md, 2 per row from lg upward */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 w-full">
        {!isLoading && data?.data?.data?.slice(0, 6)?.map((spoil, index) => (
          <motion.div
            key={spoil.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden p-4 flex flex-col sm:flex-row items-start gap-4 cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/spoil-details/${spoil.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                router.push(`/spoil-details/${spoil.id}`);
              }
            }}
          >
            {/* Thumbnail image (top on mobile, left on sm+) */}
            {spoil?.cover_image_url && (
              <div className="relative w-full h-48 sm:w-44 sm:h-[201px] rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={spoil?.cover_image_url}
                  alt={spoil.title}
                  fill
                  className="object-cover"
                  
                />

                {/* Bookmark */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addBookmark(spoil.id);
                  }}
                  disabled={isBookmarking}
                  className="absolute top-2 right-3 bg-white rounded-full p-2 shadow-md transition hover:scale-110 disabled:cursor-not-allowed"
                >
                {spoil?.is_bookmarked ?  <Image
                    src={BookedmarkIcon}
                    alt="bookmark"
                    width={15}
                    height={15}
                  />: <Image
                    src={BookmarkIcon}
                    alt="bookmark"
                    width={15}
                    height={15}
                  /> }
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1">
              {spoil.institution && (
                <p className="text-xs sm:text-sm font-medium text-[var(--color-black)] pb-1">
                  {spoil.institution}
                </p>
              )}
              <h3 className="pb-1 text-base sm:text-lg font-medium text-[var(--color-black)]">
                {spoil.title}
              </h3>
            {  spoil.pricing === "free" ?     <p className="pb-2 text-sm sm:text-lg font-semibold text-gray-900"> Free </p>
              :       <p className="pb-2 text-sm sm:text-lg font-semibold text-gray-900">
                ₦{spoil.display_amount?.toLocaleString()}
              </p>}

              <div className="flex items-center gap-3 my-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                  {spoil.tutor?.avatar ? (
                    <Image
                      src={spoil?.tutor?.avatar}
                      alt="tutor"
                      className="object-cover"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <span className="text-xs font-semibold flex items-center justify-center w-full h-full text-gray-600">
                      {spoil.tutor?.first_name?.[0]?.toUpperCase()}
                      {spoil.tutor?.last_name?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>

                <span className="text-[11px] px-3 py-1 rounded-full bg-[var(--color-blue-lightest)] text-[var(--color-blue)]">
                  {spoil.category?.name || "Category"}
                </span>
              </div>

              <HStack className="mt-2" spacing="gap-2" alignItems="center">
                <Image src={RatingIcon} alt="rating" width={18} height={18} />
                <p className="text-sm text-[var(--color-black-dark)]">
                  {spoil.average_rating?.toFixed(1) || "0.0"} ({spoil.ratings_count || 0})
                </p>
              </HStack>
            </div>
          </motion.div>
        ))}
      </div>
    </WebsiteSection>)}</>
  );
};

export default InstitutionSpoils;
