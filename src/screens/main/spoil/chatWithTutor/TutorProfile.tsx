"use client";

import { useState } from "react";

import Image from "next/image";

import useFollowTutorMutation from "@spt/hooks/apiRequests/useFollowTutorMutation";

import { RelatedSpoilCard } from "./RelatedSpoilCard";

import type { RelatedSpoilItem } from "./RelatedSpoilCard";

interface Props {
  tutorId: number;
  tutorName: string;
  tutorAvatar: string | null;
  tutorInitial: string;
  spoilsCreated: number | null;
  expertise: string | null;
  followersCount: number | null;
  description: string | null;
  relatedSpoils: RelatedSpoilItem[];
  onReport: () => void;
}

export function TutorProfile({
  tutorId,
  tutorName,
  tutorAvatar,
  tutorInitial,
  spoilsCreated,
  expertise,
  followersCount,
  description,
  relatedSpoils,
  onReport,
}: Props) {
  const [following, setFollowing] = useState(false);
  const { followTutorHandler, isLoading } = useFollowTutorMutation();

  const handleFollow = async () => {
    if (following) {
      setFollowing(false);
      return;
    }
    const result = await followTutorHandler(tutorId);
    if (result) setFollowing(true);
  };

  return (
    <div className="w-full lg:w-[420px] lg:flex-shrink-0">

      {/* Avatar + stats */}
      <div className="flex flex-col items-center text-center pb-5 border-b border-[#F1F4F7]">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-[#E8EEF2] flex items-center justify-center mb-3 shrink-0">
          {tutorAvatar ? (
            <Image
              src={tutorAvatar}
              alt={tutorName}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-[#0B5368]">{tutorInitial}</span>
          )}
        </div>

        <p className="font-bold text-[#20262D] text-base">{tutorName}</p>

        {spoilsCreated != null && (
          <p className="text-sm text-[#5F6368] mt-1">
            No of Spoylz created:{" "}
            <span className="font-medium text-[#20262D]">{spoilsCreated}</span>
          </p>
        )}

        {expertise && (
          <p className="text-sm text-[#5F6368] mt-0.5">
            Expertise:{" "}
            <span className="text-[#0B5368] font-medium underline underline-offset-2 cursor-pointer">
              {expertise}
            </span>
          </p>
        )}

        {followersCount != null && (
          <p className="text-sm text-[#5F6368] mt-0.5">{followersCount} Followers</p>
        )}

        <div className="flex items-center gap-3 mt-4 w-full max-w-xs">
          <button
            type="button"
            onClick={onReport}
            className="cursor-pointer flex-1 py-2.5 rounded-xl border border-red-500 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Report Tutor
          </button>
          <button
            type="button"
            onClick={handleFollow}
            disabled={isLoading}
            className={`cursor-pointer flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
              following
                ? "bg-[#0B5368] text-white hover:bg-[#094558]"
                : "border border-[#0B5368] text-[#0B5368] hover:bg-[#EEF7FB]"
            }`}
          >
            {isLoading ? "..." : following ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      {/* Bio */}
      <div className="py-5 border-b border-[#F1F4F7]">
        <p className="text-sm font-semibold text-[#20262D] mb-2">Bio</p>
        <p className="text-sm text-[#5F6368] leading-relaxed">
          {description ?? "No bio available for this tutor."}
        </p>
      </div>

      {/* Spoils Created */}
      {relatedSpoils.length > 0 && (
        <div className="pt-5">
          <p className="text-sm font-semibold text-[#20262D] mb-4">Spoils Created</p>
          <div className="grid grid-cols-2 gap-3">
            {relatedSpoils.slice(0, 4).map((s) => (
              <RelatedSpoilCard key={s.id} spoil={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
