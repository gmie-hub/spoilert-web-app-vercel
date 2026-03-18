"use client";

import { FiLock } from "react-icons/fi";

import type { CommunityCardItem } from "../communityTypes";

interface CommunityCardProps {
  community: CommunityCardItem;
  variant: "explore" | "member";
  onClick?: () => void;
}

const avatarStack = ["A", "B", "C"];

const CommunityCard = ({ community, variant, onClick }: CommunityCardProps) => {
  const isLocked = community.audience === "locked";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full w-full flex-col rounded-[20px] bg-white p-6 text-left shadow-[0_12px_40px_rgba(11,83,104,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(11,83,104,0.12)]"
    >
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: community.accentColor }}
      >
        {isLocked ? <FiLock className="text-base" /> : community.avatarLabel}
      </div>

      <h3 className="mt-5 text-center font-medium text-black">
        {community.name}
      </h3>

      <p className="mt-3 min-h-[72px] text-center text-sm leading-6 text-gray">
        {community.description}
      </p>

      {variant === "explore" ? (    
        <div className="mt-1">
          <span className="block rounded-xl bg-[#0B5368] px-4 py-3 text-center text-sm font-semibold text-white">
            {isLocked ? "Enroll to Access" : "Join"}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center pt-2">
          <div className="flex items-center">
            {avatarStack.map((item, index) => (
              <div
                key={`${community.id}-${item}`}
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
            <div className="-ml-2 flex h-8 items-center rounded-full border-2 border-white bg-[#FFF4E6] px-2 text-[10px] font-medium text-[#8B6B44]">
              +100
            </div>
          </div>
        </div>
      )}
    </button>
  );
};

export default CommunityCard;
