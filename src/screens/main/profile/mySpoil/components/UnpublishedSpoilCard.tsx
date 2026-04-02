"use client";

import { type FC } from "react";

import Image from "next/image";
import Link from "next/link";
import { FiCheck, FiEye } from "react-icons/fi";

import type { SpoilDatum } from "@spt/utils/spoils";

import { formatSpoilPrice, getSpoilMeta, isSpoilExpired } from "../helpers";

interface UnpublishedSpoilCardProps {
  spoil: SpoilDatum;
  spoilHref: string;
  onRepublish: (spoil: SpoilDatum) => void;
}

const UnpublishedSpoilCard: FC<UnpublishedSpoilCardProps> = ({
  spoil,
  spoilHref,
  onRepublish,
}) => {
  const meta = getSpoilMeta(spoil);
  const priceLabel = formatSpoilPrice(spoil);
  const isExpired = isSpoilExpired(spoil.expires_at);

  return (
    <article className="rounded-[24px] border border-[#F4EEE5] bg-white p-6 shadow-[0_18px_44px_rgba(196,167,119,0.12)] transition hover:shadow-[0_22px_48px_rgba(196,167,119,0.18)] sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Link
          href={spoilHref}
          className="relative block h-[162px] w-full shrink-0 overflow-hidden rounded-[20px] bg-[#E8EEF2] sm:w-[160px]"
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
            <h3 className="line-clamp-2 text-[20px] font-medium leading-[1.35] text-[#2B2F38] sm:text-[22px]">
              {spoil.title}
            </h3>
          </Link>

          <p className="mt-2 text-[18px] font-semibold text-[#20262D] sm:text-[20px]">
            {priceLabel}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex min-h-11 items-center rounded-[14px] bg-[#EAF7FF] px-4 py-2 text-sm font-medium text-[#0B5368]">
              {meta.category}
            </span>
            {isExpired ? (
              <span className="inline-flex min-h-11 items-center rounded-[14px] bg-[#FFF1F3] px-4 py-2 text-sm font-medium text-[#F04438]">
                Expired
              </span>
            ) : null}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-nowrap">
            <button
              type="button"
              onClick={() => onRepublish(spoil)}
              className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-[14px] bg-[#0B5368] px-5 text-base font-semibold text-white transition hover:bg-[#09485A] sm:w-auto sm:min-w-[132px]"
            >
              <FiCheck className="text-[18px]" />
              <span>Republish</span>
            </button>

            <Link
              href={spoilHref}
              className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-[14px] border border-[#D6DDE3] bg-white px-5 text-base font-semibold text-[#0B5368] transition hover:bg-[#F8FBFD] sm:w-auto sm:min-w-[120px]"
            >
              <FiEye className="text-[18px]" />
              <span>View</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default UnpublishedSpoilCard;
