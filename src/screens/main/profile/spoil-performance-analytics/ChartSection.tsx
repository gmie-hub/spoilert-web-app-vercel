"use client";

import { type MouseEvent, type ReactNode, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiChevronRight } from "react-icons/fi";

import type { PerformanceItem } from "@spt/hooks/apiRequests/useGetSpoilPerformanceQuery";

import {
  type Series,
  type Slice,
  TRACK_COLOR,
  formatCompact,
  formatShare,
  formatValue,
  toSlices,
} from "./chartData";

const RADIUS = 38;
const STROKE = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// About 2px of white between slices at the 160px size.
const SLICE_GAP = 1.25;

// Stops a click inside the card from also opening the card's own page.
const stopCardClick = (e: MouseEvent) => e.stopPropagation();

function DonutChart({
  slices,
  total,
  active,
  onActivate,
  onSelect,
}: {
  slices: Slice[];
  total: number;
  active: string | null;
  onActivate: (key: string | null) => void;
  onSelect: (slice: Slice, e: MouseEvent) => void;
}) {
  const drawn = slices.filter((slice) => slice.value > 0);
  const arcs = drawn.map((slice, index) => {
    const start = drawn
      .slice(0, index)
      .reduce((sum, previous) => sum + (previous.value / total) * CIRCUMFERENCE, 0);
    const length = (slice.value / total) * CIRCUMFERENCE;
    const gap = drawn.length > 1 ? Math.min(SLICE_GAP, length / 2) : 0;

    return { slice, start, dash: length - gap };
  });

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <circle cx="50" cy="50" r={RADIUS} fill="none" stroke={TRACK_COLOR} strokeWidth={STROKE} />
      {/* Start at 12 o'clock and run clockwise. */}
      <g transform="rotate(-90 50 50)">
        {arcs.map(({ slice, start, dash }) => (
          <circle
            key={slice.key}
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={slice.color}
            strokeWidth={STROKE}
            strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
            strokeDashoffset={-start}
            style={{
              opacity: active && active !== slice.key ? 0.3 : 1,
              transition: "opacity 150ms",
            }}
            onMouseEnter={() => onActivate(slice.key)}
            onMouseLeave={() => onActivate(null)}
            onClick={(e) => onSelect(slice, e)}
          />
        ))}
      </g>
    </svg>
  );
}

const mySpoilHref = (spoilId: number) => `/profile/my-spoils/${spoilId}`;

function ChartSection({
  title,
  href,
  linkLabel,
  itemHref = mySpoilHref,
  items,
  series,
  isCurrency,
  className = "",
}: {
  title: string;
  href: string;
  linkLabel: string;
  // Where a Spoylz in this chart opens: its My Spoylz page unless set.
  itemHref?: (spoilId: number) => string;
  items: PerformanceItem[];
  series: Series[];
  isCurrency?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  const [showOther, setShowOther] = useState(false);

  const slices = toSlices(items, series);
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const activeSlice = slices.find((slice) => slice.key === active);
  const hrefFor = (item: { spoilId: number | null }) =>
    item.spoilId != null ? itemHref(item.spoilId) : null;

  // A Spoylz's slice opens its page; "Other" (or a Spoylz without an id)
  // falls through to the card's page.
  const selectSlice = (slice: Slice, e: MouseEvent) => {
    const sliceHref = hrefFor(slice);
    if (!sliceHref) return;
    e.stopPropagation();
    router.push(sliceHref);
  };

  const rowClass =
    "group flex items-start gap-2 rounded-lg px-2 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#0B5368]/30";

  const renderRow = (slice: Slice): ReactNode => {
    const rowHref = hrefFor(slice);
    const content = (
      <>
        <span
          aria-hidden="true"
          className="mt-[7px] h-2.5 w-2.5 flex-shrink-0 rounded-full"
          style={{ backgroundColor: slice.color }}
        />
        <span
          className={`min-w-0 flex-1 text-[15px] leading-snug text-[#495057] ${
            rowHref ? "group-hover:text-[#0B5368] group-hover:underline" : ""
          }`}
        >
          {slice.label}
        </span>
        <span className="flex-shrink-0 text-[15px] font-semibold leading-snug tabular-nums text-[#212529]">
          {formatValue(slice.value, isCurrency)}
        </span>
        <span className="w-10 flex-shrink-0 text-right text-[13px] leading-[22px] tabular-nums text-[#6B7280]">
          {formatShare(slice.value, total)}
        </span>
      </>
    );

    return rowHref ? (
      <Link href={rowHref} prefetch={false} onClick={stopCardClick} className={rowClass}>
        {content}
      </Link>
    ) : (
      <div tabIndex={0} className={rowClass}>
        {content}
      </div>
    );
  };

  return (
    // The whole card opens its page; the header link does the same for
    // keyboard users.
    <div
      onClick={() => router.push(href)}
      className={`flex cursor-pointer flex-col rounded-[8px] border border-[#EFEFEF] px-4 py-6 transition-shadow hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[18px] font-semibold text-[#212529]">{title}</h3>
        <Link
          href={href}
          onClick={stopCardClick}
          className="flex flex-shrink-0 items-center gap-0.5 rounded text-sm font-medium text-[#0B5368] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5368]/30"
        >
          {linkLabel}
          <FiChevronRight aria-hidden="true" />
        </Link>
      </div>

      <div className="relative mx-auto mt-4 h-40 w-40">
        <DonutChart
          slices={slices}
          total={total}
          active={active}
          onActivate={setActive}
          onSelect={selectSlice}
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <span className="text-[18px] font-semibold leading-tight text-[#212529]">
            {formatCompact(activeSlice ? activeSlice.value : total, isCurrency)}
          </span>
          <span className="text-[12px] text-[#495057]">
            {activeSlice ? formatShare(activeSlice.value, total) : "Total"}
          </span>
          {activeSlice && (
            <span className="mt-0.5 w-full truncate text-[11px] text-[#6B7280]">
              {activeSlice.label}
            </span>
          )}
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-1">
        {slices.map((slice) => (
          <li
            key={slice.key}
            onMouseEnter={() => setActive(slice.key)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(slice.key)}
            onBlur={() => setActive(null)}
            className={`rounded-lg transition-colors ${
              active === slice.key ? "bg-[#F4F7F9]" : ""
            }`}
          >
            {renderRow(slice)}

            {slice.members && (
              <div className="ml-[26px] pb-1.5 pr-2">
                {showOther && (
                  <ul className="mt-1 flex flex-col gap-1">
                    {slice.members.map((member) => {
                      const memberHref = hrefFor(member);
                      const content = (
                        <>
                          <span className="min-w-0 flex-1">{member.title}</span>
                          <span className="flex-shrink-0 tabular-nums">
                            {formatValue(member.value, isCurrency)}
                          </span>
                        </>
                      );

                      return (
                        <li key={member.key}>
                          {memberHref ? (
                            <Link
                              href={memberHref}
                              prefetch={false}
                              onClick={stopCardClick}
                              className="flex items-start gap-2 rounded text-[13px] text-[#6B7280] hover:text-[#0B5368] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5368]/30"
                            >
                              {content}
                            </Link>
                          ) : (
                            <div className="flex items-start gap-2 text-[13px] text-[#6B7280]">
                              {content}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    stopCardClick(e);
                    setShowOther((open) => !open);
                  }}
                  className="mt-1 text-[13px] font-medium text-[#0B5368] hover:underline"
                >
                  {showOther ? "Hide" : `Show all ${slice.members.length}`}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChartSection;
