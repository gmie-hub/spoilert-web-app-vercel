"use client";

import React from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiLock } from "react-icons/fi";

import useJoinCommunityMutation from "@spt/hooks/apiRequests/useJoinCommunityMutation";

import type { CommunityCardItem } from "../communityTypes";

interface CommunityCardProps {
  community: CommunityCardItem;
  variant: "explore" | "member";
  onClick?: (id: string) => void;
}

const avatarStack = ["A", "B", "C"];

const CommunityCard = ({ community, variant, onClick }: CommunityCardProps) => {
  // If locked===1 and spoil.is_enrolled===true, treat as not locked
  const isLocked = community?.locked === 1 && community?.spoil?.is_enrolled !== true;


  const { joinCommunityHandler, isLoading } = useJoinCommunityMutation();
  const router = useRouter();

  // Card click: only navigate or call onClick, never join
  const handleCardClick = () => {
    if (onClick) {
      onClick(String(community.id));
      return;
    }
    // Default: navigate to community detail if needed (optional)
    // router.push(`/community/${community.id}`);
  };

  // Button click: join or enroll
  const handleJoinClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      const spoilId = community?.spoil_id || "";
      if (spoilId) {
        router.push(`/spoil-details/${spoilId}`);
      }
      return;
    }
    await joinCommunityHandler(community.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") handleCardClick();
      }}
      className="flex h-full w-full flex-col rounded-[20px] bg-white p-6 text-left shadow-[0_12px_40px_rgba(11,83,104,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(11,83,104,0.12)] cursor-pointer"
    >
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white overflow-hidden"
        style={{ backgroundColor: community.accentColor }}
      >
        {isLocked ? (
          <FiLock className="text-base" />
        ) : community && community?.avatarUrl ? (
          <Image
            src={community?.avatarUrl}
            alt={`${community?.name} cover`}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        ) : (
          community.avatarLabel
        )}
      </div>

      <h3 className="mt-5 text-center font-medium text-black">
        {community.name}
      </h3>

      <p className="mt-3 min-h-[72px] text-center text-sm leading-6 text-gray">
        {community.description}
      </p>

      {variant === "explore" ? (
        <div className="mt-1">
          <button
            type="button"
            onClick={handleJoinClick}
            className="block w-full rounded-xl bg-[#0B5368] px-4 py-3 text-center text-sm font-semibold text-white"
            disabled={isLoading}
          >
            {isLocked ? "Enroll to Access" : isLoading ? "Joining..." : "Join"}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center pt-2">
          <div className="flex items-center">
            {(() => {
              const membersCount = Number( community?.total_members ?? 0);
              const maxStack = 3;
              if (membersCount <= 1) {
                return (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-white bg-[#D87B00]">
                    {community?.avatarLabel ?? "U"}
                  </div>
                );
              }

              const stackCount = Math.min(maxStack, membersCount);
              const extras = Math.max(0, membersCount - stackCount);
              const items = Array.from({ length: stackCount }).map((_, i) =>
                i === 0 ? (community?.avatarLabel ?? avatarStack[0]) : avatarStack[i] ?? ""
              );

              return (
                <>
                  {items.map((item, index) => (
                    <div
                      key={`${community.id}-${item}-${index}`}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-white ${
                        index === 0
                          ? "bg-[#D87B00]"
                          : index === 1
                            ? "bg-[#DDE7EF] text-[#0B5368]"
                            : "bg-[#F7D6B9] text-[#7D5B33]"
                      } ${index > 0 ? "-ml-2" : ""}`}
                    >
                      {item}
                    </div>
                  ))}

                  {extras > 0 && (
                    <div className="-ml-2 flex h-8 items-center rounded-full border-2 border-white bg-[#FFF4E6] px-2 text-[10px] font-medium text-[#8B6B44]">
                      +{extras}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityCard;
