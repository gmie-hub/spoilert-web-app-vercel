"use client";

import React, { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiChevronRight,
  FiShare2,
  FiThumbsUp,
  FiTrash2,
} from "react-icons/fi";

import BookIcon from "@spt/assets/icons/bookIcon.svg";
import EditIcon from "@spt/assets/icons/border-edit.svg";
import ClockIcon from "@spt/assets/icons/clock.svg";
import HeroFallback from "@spt/assets/icons/heroimage1.svg";
import MessagesIcon from "@spt/assets/icons/messages-2.svg";
import Profile from "@spt/assets/icons/profile-2user.svg";
import StarIcon from "@spt/assets/icons/star.svg";
import useCreateCommunityMutation from "@spt/hooks/apiRequests/useCreateCommunityMutation";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";
import useShareSpoilMutation from "@spt/hooks/apiRequests/useShareSpoilMutation";
import ShareLinkModal from "@spt/screens/main/home/spoilDetails/ShareLinkModal";

import Details from "../../../home/spoilDetails/details";
import SponsorSpoilModal from "../../../home/spoilDetails/SponsorSpoilModal";
import { LoadingState } from "../../../spoil/preSpoilQuiz/components/LoadingState";

interface MySpoilDetailViewProps {
  spoilId: number;
  onBack: () => void;
}

const MySpoilDetailView: React.FC<MySpoilDetailViewProps> = ({
  spoilId,
  onBack,
}) => {
  const router = useRouter();
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const { shareSpoil } = useShareSpoilMutation();

  const { data: spoil, isLoading } = useGetSpoilDetailsQuery(spoilId);
  const { createCommunityHandler, isLoading: isCreatingCommunity } =
    useCreateCommunityMutation();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!spoil) {
    return null;
  }

  const isFreeSpoil = spoil.pricing?.toLowerCase() === "free";
  const price = isFreeSpoil
    ? "Free"
    : `₦${(spoil.display_amount ?? spoil.amount ?? 0).toLocaleString()}`;

  const category = spoil.category?.name ?? "Uncategorized";
  const rating = (spoil.average_rating ?? 0).toFixed(1);
  const ratingsCount = spoil.ratings_count ?? 0;
  const heroImage = spoil.cover_image_url || HeroFallback;
  const isFallbackImage = !spoil.cover_image_url;
  const amountEarned =
    (spoil.display_amount ?? 0) * (spoil.enrolled_users ?? 0);

  const editHref =
    spoil.type === "simple"
      ? `/create-spoils/simple-spoil?spoilId=${spoil.id}`
      : `/create-spoils/advance-spoil?spoilId=${spoil.id}`;

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white z-10 border-b border-[#F1F4F7]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-[#20262D] hover:opacity-70 transition-opacity"
        >
          <FiArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative p-1.5 rounded-full hover:bg-[#F3F7F9] transition-colors"
          >
            <Image src={MessagesIcon} alt=  "Messages" width={22} height={22} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-semibold">
              1
            </span>
          </button>

          {spoil?.community === null && (
            <button
              type="button"
              disabled={isCreatingCommunity}
              onClick={() => createCommunityHandler({ spoil_id: spoil.id })}
              className="flex items-center gap-1.5 bg-[#0B5368] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#09485A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCreatingCommunity ? "Creating..." : "Create Community"}
              {!isCreatingCommunity && <FiChevronRight size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Hero image */}
      <div className="relative w-full h-[200px] sm:h-[260px] md:h-[300px] overflow-hidden">
        <Image
          src={heroImage}
          alt={spoil.title}
          fill
          sizes="100vw"
          quality={90}
          placeholder={isFallbackImage ? "blur" : "empty"}
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-5 max-w-3xl mx-auto lg:max-w-none">
        {/* Edit + Unpublish buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => router.push(editHref)}
            className="flex items-center gap-2 bg-[#0B5368] text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#09485A] transition-colors"
          >
            <Image src={EditIcon} alt="edit" width={16} height={16} />
            Edit Spoil
          </button>
          <button
            type="button"
            className="flex items-center gap-2 border border-red-500 text-red-500 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
          >
            <FiTrash2 size={14} />
            Unpublish Spoil
          </button>
        </div>

        {/* Institution */}
        {spoil.institution ? (
          <p className="mt-5 text-sm text-[#8A98A3]">{spoil.institution}</p>
        ) : null}

        {/* Title */}
        <h1 className="mt-1 text-lg sm:text-xl font-semibold text-[#20262D] leading-snug">
          {spoil.title}
        </h1>

        {/* Price */}
        <p className="mt-2 text-xl font-bold text-[#20262D]">{price}</p>

        {/* Share + View Stats */}
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <button
            onClick={() => {
              shareSpoil(spoil.id);
              setIsShareModalOpen(true);
            }}
            type="button"
            className="flex items-center gap-2 border border-[#E0E0E0] px-4 py-2 rounded-xl text-sm text-[#20262D] hover:border-[#B0B0B0] transition-colors"
          >
            <FiShare2 size={14} />
            Share
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile/spoil-stats")}
            className="flex items-center gap-2 border border-[#E0E0E0] px-4 py-2 rounded-xl text-sm text-[#20262D] hover:border-[#B0B0B0] transition-colors"
          >
            View Stats
            <FiArrowRight size={14} />
          </button>
        </div>

        {/* Category + Rating tags */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-md bg-[#EEF7FB] text-[#0B5368] text-sm font-medium">
            {category}
          </span>
          <span className="px-3 py-1 rounded-md border border-[#E0E0E0] text-sm flex items-center gap-1 text-[#20262D]">
            <Image src={StarIcon} alt="rating" width={16} height={16} />
            {rating} ({ratingsCount})
          </span>
        </div>

        {/* Module + Lesson stats */}
        <div className="mt-3 flex items-center gap-5 text-sm text-[#6B7280] flex-wrap">
          <span className="flex items-center gap-1.5">
            <Image src={BookIcon} alt="modules" width={16} height={16} />
            {spoil.modules_no ?? 0} Modules
          </span>
          <span className="flex items-center gap-1.5">
            <Image src={ClockIcon} alt="lessons" width={16} height={16} />
            {spoil.lessons_no ?? 0} Lessons
          </span>
        </div>

        {/* Engagement: likes + shares */}
        <div className="mt-3 flex items-center gap-5 text-sm text-[#6B7280]">
          <span className="flex items-center gap-1.5">
            <FiThumbsUp size={15} />
            {spoil.likes_count ?? 0}
          </span>
          <span className="flex items-center gap-1.5">
            <FiShare2 size={15} />
            {spoil.shares_count ?? 0}
          </span>
        </div>

        {/* Sponsor Spoil + Enrolled Learners CTAs */}
        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setIsSponsorModalOpen(true)}
            className="flex items-center gap-2 border border-[#0B5368] text-[#0B5368] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#F0F8FB] transition-colors"
          >
            Sponsor Spoil
            <FiArrowRight size={14} />
          </button>
          {spoil?.enrolled_users === 0 && (
            <button
              type="button"
              onClick={() => router.push(`/my-spoils/${spoilId}/enrolled-learners`)}
              className="flex items-center gap-2 border border-[#0B5368] text-[#0B5368] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#F0F8FB] transition-colors"
            >
              Enrolled Learners
              <FiArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Stats cards */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {/* Learners Enrolled */}
          <div className="bg-[#FFF3E4] rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-[#F97316] rounded-xl flex items-center justify-center shrink-0">
                <Image src={Profile} alt="learners" width={18} height={18} />
              </div>
              <span className="text-xs sm:text-sm text-[#6B7280] leading-tight">
                Learners Enrolled
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold text-[#20262D]">
              {(spoil.enrolled_users ?? 0).toLocaleString()}
            </p>
          </div>

          {/* Amount Earned */}
          <div className="bg-[#F5EEFF] rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-[#A855F7] rounded-xl flex items-center justify-center shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-[#6B7280] leading-tight">
                Amount Earned
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold text-[#20262D]">
              ₦{amountEarned.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tabs: Overview, Spoil Outline, Reviews */}
        <div className="mt-8">
          <Details spoil={spoil} />
        </div>
      </div>

      <SponsorSpoilModal
        open={isSponsorModalOpen}
        onClose={() => setIsSponsorModalOpen(false)}
        spoil={spoil}
      />

      <ShareLinkModal
        open={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={`${typeof window !== "undefined" ? window.location.origin : ""}/spoil-details/${spoil.id}`}
      />
    </div>
  );
};

export default MySpoilDetailView;
