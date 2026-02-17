"use client";

import React from "react";

import Image from "next/image";

import Icon1 from "@spt/assets/icons/Icon(3).svg";
import WebsiteSection from "@spt/components/websiteSection";

const categories = [
  {
    id: 1,
    title: "UI/UX Design",
    spoils: "20 Spoils",
    image: "/categories/uiux.jpg",
  },
  {
    id: 2,
    title: "Software Development",
    spoils: "20 Spoils",
    image: "/categories/software.jpg",
  },
  {
    id: 3,
    title: "Analytics",
    spoils: "20 Spoils",
    image: "/categories/analytics.jpg",
  },
  {
    id: 4,
    title: "Marketing",
    spoils: "20 Spoils",
    image: "/categories/marketing.jpg",
  },
  {
    id: 5,
    title: "Branding",
    spoils: "20 Spoils",
    image: "/categories/branding.jpg",
  },
  {
    id: 6,
    title: "Business",
    spoils: "20 Spoils",
    image: "/categories/business.jpg",
  },
  {
    id: 7,
    title: "Health & Science",
    spoils: "20 Spoils",
    image: "/categories/health.jpg",
  },
  {
    id: 8,
    title: "Productivity",
    spoils: "20 Spoils",
    image: "/categories/productivity.jpg",
  },
];

export default function SpoilInCategories() {
  return (
    <WebsiteSection className="my-8">
      <div className="flex flex-col gap-3 mb-6">
        <h2 className="text-2xl font-semibold">UI/UX Design Spoils</h2>

        <div className="w-1/3 sm:w-auto">
          <input
            placeholder="Search category..."
            className="px-4 py-2 rounded-lg border border-gray-200 w-full sm:w-64 outline-none focus:ring-2 focus:ring-[#063B4A]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="relative rounded-2xl overflow-hidden h-52"
          >
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="absolute bottom-3 left-3 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-black text-xs">
                  <Image src={Icon1} alt="icon" width={20} height={20} />
                </span>
              </div>
              <h3 className="text-sm font-semibold">{cat.title}</h3>

              <p className="text-xs text-white/80">{cat.spoils}</p>
            </div>
          </div>
        ))}
      </div>
    </WebsiteSection>
  );
}
