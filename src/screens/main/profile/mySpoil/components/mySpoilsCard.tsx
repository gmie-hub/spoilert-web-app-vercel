"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiEdit2,
  FiShare2,
  FiThumbsUp,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";

import EditIcon from "@spt/assets/icons/border-edit.svg"
import MoreIcon from "@spt/assets/icons/more.svg"
import type { SpoilDatum } from "@spt/utils/spoils";

import {
  formatScheduledSpoilDate,
  formatSpoilPrice,
  getMySpoilStatusLabel,
  getSpoilMeta,
} from "../helpers";

import UnpublishedSpoilCard from "./UnpublishedSpoilCard";

import type { MySpoilTabId } from "../../types";

interface MySpoilsCardProps {
  spoil: SpoilDatum;
  activeTab: MySpoilTabId;
  onRepublish?: (spoil: SpoilDatum) => void;
}

const MySpoilsCard = ({ spoil, activeTab, onRepublish }: MySpoilsCardProps) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const meta = getSpoilMeta(spoil);
  const statusLabel = getMySpoilStatusLabel(activeTab, spoil);
  const priceLabel = formatSpoilPrice(spoil);
  const spoilHref = `/spoil-details/${spoil.id}`;
  const isDraftCard = activeTab === "drafts";
  const scheduledLabel = formatScheduledSpoilDate(spoil.premiere_at);
  const editSpoilHref =
    spoil.type === "simple"
      ? `/create-spoils/simple-spoil?spoilId=${spoil.id}`
      : `/create-spoils/advance-spoil?spoilId=${spoil.id}`;

  const handleEditSpoil = () => {
    setIsMenuOpen(false);
    router.push(editSpoilHref);
  };

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

  if (activeTab === "unpublished") {
    return (
      <UnpublishedSpoilCard
        spoil={spoil}
        spoilHref={spoilHref}
        onRepublish={onRepublish ?? (() => {})}
      />
    );
  }

  if (isDraftCard) {
    return (
      <article className="rounded-[22px] border border-[#F1F4F7] bg-white p-4 shadow-[0_16px_44px_rgba(11,83,104,0.08)] transition hover:shadow-[0_18px_50px_rgba(11,83,104,0.12)] sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Link
            href={spoilHref}
            className="relative block h-[160px] w-full shrink-0 overflow-hidden rounded-[22px] bg-[#E8EEF2] sm:h-[178px] sm:w-[176px]"
          >
            <Image
              src={spoil.cover_image_url}
              alt={spoil.title}
              fill
              className="object-cover"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <Link href={spoilHref} className="block">
              <h3 className="font-medium leading-[1.25] tracking-[-0.03em] text-[#20262D]">
                {spoil.title}
              </h3>
            </Link>

            <p className="mt-1.5 text-sm text-[#5F6B76]">
              Scheduled for {scheduledLabel}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-[12px] bg-[#DDF0FF] px-4 py-2 text-sm font-medium text-[#3DA8FC]">
                {statusLabel}
              </span>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-[12px] border border-[#D6DDE3] bg-white px-5 py-2.5 text-sm font-medium text-[#0B5368] transition hover:border-[#B9C8D3] hover:bg-[#F8FBFD]"
              >
                Change Date &amp; Time
              </button>
            </div>

            <button
              type="button"
              onClick={handleEditSpoil}
              className="mt-5 inline-flex items-center gap-3 rounded-[14px] bg-[#0C4F63] cursor-pointer px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#093D4C]"
            >
              <Image src={EditIcon} alt="edit" width={20} height={20} />
              <span>Edit Spoil</span>
            </button>
          </div>
        </div>
      </article>
    );
  }

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
                <Image src={MoreIcon} alt="more" width={20} height={20} />
              </button>

              {isMenuOpen ? (
                <div className="absolute right-0 top-8 z-20 min-w-[203px] rounded-[14px] border border-[#EEF3F6] bg-white p-2 shadow-[0_22px_48px_rgba(17,24,39,0.12)]">
                  <Link
                    href={spoilHref}
                    className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-sm text-[#4A5560] transition hover:bg-[#F7FBFD]"
                  >
                    <FiUsers className="text-[14px]" />
                    <span>View Spoil</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleEditSpoil}
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
