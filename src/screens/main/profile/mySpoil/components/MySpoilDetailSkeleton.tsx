"use client";

import React from "react";

const TONES = {
  base: "bg-gray-200",
  soft: "bg-gray-100",
  // On the tinted stats cards.
  tint: "bg-black/5",
};

interface BoneProps {
  className?: string;
  tone?: keyof typeof TONES;
  rounded?: string;
}

// Grey placeholder block. Sizes below mirror MySpoilDetailView's real elements
// (same paddings, gaps and heights) so the page doesn't jump when data lands.
// Tone and radius are props, not extra classes, so they never clash with a default.
const Bone = ({ className = "", tone = "base", rounded = "rounded" }: BoneProps) => (
  <div className={`animate-pulse ${TONES[tone]} ${rounded} ${className}`} />
);

const MySpoilDetailSkeleton = () => (
  <div
    className="w-full min-h-screen bg-white"
    role="status"
    aria-busy="true"
    aria-label="Loading Spoylz details"
  >
    {/* Header: Back */}
    <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white z-10 border-b border-[#F1F4F7]">
      <Bone className="h-5 w-16" />
    </div>

    {/* Hero image */}
    <Bone className="w-full h-[200px] sm:h-[260px] md:h-[300px]" rounded="rounded-none" />

    {/* Content */}
    <div className="px-4 sm:px-6 py-5 max-w-3xl mx-auto lg:max-w-none">
      {/* Edit + Unpublish buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <Bone className="h-10 w-[128px]" rounded="rounded-xl" />
        <Bone className="h-[42px] w-[168px]" rounded="rounded-xl" />
      </div>

      {/* Institution */}
      <Bone className="mt-5 h-4 w-32" tone="soft" />

      {/* Title */}
      <Bone className="mt-2 h-6 w-3/4 sm:w-1/2" />

      {/* Price */}
      <Bone className="mt-3 h-7 w-24" />

      {/* Share + View Stats */}
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <Bone className="h-[38px] w-[92px]" tone="soft" rounded="rounded-xl" />
        <Bone className="h-[38px] w-[124px]" tone="soft" rounded="rounded-xl" />
      </div>

      {/* Category + Rating tags */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <Bone className="h-7 w-28" tone="soft" rounded="rounded-md" />
        <Bone className="h-7 w-20" tone="soft" rounded="rounded-md" />
      </div>

      {/* Module + Lesson stats */}
      <div className="mt-3 flex items-center gap-5 flex-wrap">
        <Bone className="h-5 w-24" tone="soft" />
        <Bone className="h-5 w-24" tone="soft" />
      </div>

      {/* Likes + shares */}
      <div className="mt-3 flex items-center gap-5">
        <Bone className="h-5 w-12" tone="soft" />
        <Bone className="h-5 w-12" tone="soft" />
      </div>

      {/* Sponsor Spoylz */}
      <div className="mt-5 flex items-center gap-3 flex-wrap">
        <Bone className="h-[42px] w-[150px]" rounded="rounded-xl" />
      </div>

      {/* Stats cards: same tinted shells as the real cards */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {["bg-[#FFF3E4]", "bg-[#F5EEFF]"].map((tint) => (
          <div key={tint} className={`${tint} rounded-2xl p-4 sm:p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <Bone className="w-9 h-9 shrink-0" tone="tint" rounded="rounded-xl" />
              <Bone className="h-4 w-20 sm:w-28" tone="tint" />
            </div>
            <Bone className="h-8 sm:h-9 w-16 sm:w-24" tone="tint" />
          </div>
        ))}
      </div>

      {/* Tabs (Overview / Spoylz Outline / Reviews) + Reviews card */}
      <div className="mt-8 mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="flex w-full border-b border-gray-200">
            <div className="px-4 py-2 border-b-2 border-gray-200">
              <Bone className="h-5 w-16" />
            </div>
            <div className="px-4 py-2">
              <Bone className="h-5 w-24" tone="soft" />
            </div>
            {/* Reviews is a tab only below lg; above it, it's the side card. */}
            <div className="px-4 py-2 lg:hidden">
              <Bone className="h-5 w-14" tone="soft" />
            </div>
          </div>

          {/* Overview: description */}
          <div className="mt-4 mb-4 space-y-3">
            <Bone className="h-4 w-full" tone="soft" />
            <Bone className="h-4 w-full" tone="soft" />
            <Bone className="h-4 w-11/12" tone="soft" />
            <Bone className="h-4 w-4/5" tone="soft" />
          </div>

          {/* What you will learn */}
          <Bone className="mt-6 mb-4 h-5 w-40" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Bone className="h-5 w-5 shrink-0" rounded="rounded-full" />
                <Bone className="h-4 flex-1" tone="soft" />
              </div>
            ))}
          </div>
        </div>

        <aside className="hidden lg:block lg:col-span-5">
          <div className="bg-white rounded-xl shadow-sm border border-[#F1F1F1] p-4">
            <Bone className="h-6 w-20 mb-3" />
            <div className="rounded-lg border border-[#F3F3F3] bg-white p-4">
              <div className="flex items-center gap-2">
                <Bone className="h-5 w-5" rounded="rounded-full" />
                <Bone className="h-5 w-16" />
              </div>
              <Bone className="mt-3 h-4 w-48" tone="soft" />
              <Bone className="mt-2 h-4 w-full" tone="soft" />
            </div>
          </div>
        </aside>
      </div>
    </div>

    <span className="sr-only">Loading Spoylz details…</span>
  </div>
);

export default MySpoilDetailSkeleton;
