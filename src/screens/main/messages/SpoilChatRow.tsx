"use client";

import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";

import HeroFallback from "@spt/assets/icons/heroimage1.svg";

interface Props {
  title: string;
  coverImageUrl?: string | null;
  subtitle: string;
  unread: number;
  onClick: () => void;
}

/** One Spoylz in "Spoylz Chats", with its unread count. */
export function SpoilChatRow({ title, coverImageUrl, subtitle, unread, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors text-left border-b border-[#F1F4F7] last:border-0 cursor-pointer"
    >
      <div className="relative w-[60px] h-[60px] rounded-xl overflow-hidden shrink-0 bg-gray-200">
        <Image
          src={coverImageUrl || HeroFallback}
          alt={title}
          fill
          unoptimized={Boolean(coverImageUrl)}
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#20262D] line-clamp-2">{title}</p>
        <p className={`text-xs mt-1 truncate ${unread > 0 ? "text-[#0B5368] font-medium" : "text-[#8A98A3]"}`}>
          {subtitle}
        </p>
      </div>

      {unread > 0 && (
        <span className="min-w-[22px] h-[22px] rounded-full bg-[#0B5368] text-white text-[11px] font-bold flex items-center justify-center px-1.5 shrink-0">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
      <FiChevronRight size={18} className="text-[#C4C4C4] shrink-0" />
    </button>
  );
}

export function SpoilChatRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-[#F1F4F7]">
      <div className="w-[60px] h-[60px] rounded-xl bg-gray-200 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-1/3 rounded bg-gray-100 animate-pulse" />
      </div>
    </div>
  );
}
