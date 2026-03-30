"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import {
  FiEdit2,
  FiMoreHorizontal,
  FiShare2,
  FiThumbsUp,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";

import type { SpoilDatum } from "@spt/utils/spoils";

import {
  formatSpoilPrice,
  getMySpoilStatusLabel,
  getSpoilMeta,
} from "../helpers";

import type { MySpoilTabId } from "../../types";

interface MySpoilsCardProps {
  spoil: SpoilDatum;
  activeTab: MySpoilTabId;
}

const MySpoilsCard = ({ spoil, activeTab }: MySpoilsCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const meta = getSpoilMeta(spoil);
  const statusLabel = getMySpoilStatusLabel(activeTab, spoil);
  const priceLabel = formatSpoilPrice(spoil);
  const spoilHref = `/spoil-details/${spoil.id}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <article className="rounded-[18px] border border-[#F1F4F7] bg-white p-3 shadow-[0_16px_44px_rgba(11,83,104,0.08)] transition hover:shadow-[0_18px_50px_rgba(11,83,104,0.12)]">
      <div className="flex gap-3">
        <Link
          href={spoilHref}
          className="relative block h-[100px] w-[86px] shrink-0 overflow-hidden rounded-[14px] bg-[#E8EEF2]"
        >
          <Image
            src={spoil.cover_image_url}
            alt={spoil.title}
            fill
            className="object-cover"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[11px] text-[#8A98A3]">
                {meta.institution}
              </p>
              <Link
                href={spoilHref}
                className="mt-1 block"
              >
                <h3 className="line-clamp-3 text-sm font-medium leading-6 text-[#20262D]">
                  {spoil.title}
                </h3>
              </Link>
            </div>

            <div ref={menuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsMenuOpen((current) => !current)}
                className="rounded-full p-1 text-[#7E8B95] transition hover:bg-[#F3F7F9] hover:text-[#20262D]"
                aria-label="Open spoil actions"
              >
                <FiMoreHorizontal className="text-[18px]" />
              </button>

              {isMenuOpen ? (
                <div className="absolute right-0 top-8 z-20 min-w-[160px] rounded-[14px] border border-[#EEF3F6] bg-white p-2 shadow-[0_22px_48px_rgba(17,24,39,0.12)]">
                  <Link
                    href={spoilHref}
                    className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-sm text-[#4A5560] transition hover:bg-[#F7FBFD]"
                  >
                    <FiUsers className="text-[14px]" />
                    <span>View Spoil</span>
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-sm text-[#4A5560] transition hover:bg-[#F7FBFD]"
                  >
                    <FiEdit2 className="text-[14px]" />
                    <span>Edit Spoil</span>
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-sm text-[#4A5560] transition hover:bg-[#F7FBFD]"
                  >
                    <FiShare2 className="text-[14px]" />
                    <span>Promote Spoil</span>
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-sm text-[#F04438] transition hover:bg-[#FFF5F5]"
                  >
                    <FiTrash2 className="text-[14px]" />
                    <span>Unpublish Spoil</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <p className="mt-2 text-base font-semibold text-[#20262D]">
            {priceLabel}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                priceLabel === "Free"
                  ? "bg-[#EAFBF0] text-[#36A853]"
                  : "bg-[#EEF7FB] text-[#0B5368]"
              }`}
            >
              {priceLabel}
            </span>
            <span className="rounded-full bg-[#EEF7FB] px-2.5 py-1 text-[10px] font-medium text-[#0B5368]">
              {meta.category}
            </span>
            <span className="rounded-full bg-[#FFF4D8] px-2.5 py-1 text-[10px] font-medium text-[#D69200]">
              {statusLabel}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3 text-xs text-[#7E8B95]">
            <span className="inline-flex items-center gap-1">
              <FiThumbsUp className="text-[13px]" />
              {meta.likes}
            </span>
            <span className="inline-flex items-center gap-1">
              <FiShare2 className="text-[13px]" />
              {meta.shares}
            </span>
            <span className="inline-flex items-center gap-1">
              <FiUsers className="text-[13px]" />
              {meta.learners}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MySpoilsCard;
