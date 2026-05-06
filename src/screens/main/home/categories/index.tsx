"use client";

import React, { useMemo, useState } from "react";

import Image from "next/image";

import Icon1 from "@spt/assets/icons/Icon(3).svg";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetAllCategoriesQuery } from "@spt/hooks/apiRequests/useGetAllCategoriesQuery";

const fallbackCategories = [
  { id: 1, title: "UI/UX Design", spoils: "20 Spoils", image: "/categories/uiux.jpg" },
  { id: 2, title: "Software Development", spoils: "20 Spoils", image: "/categories/software.jpg" },
  { id: 3, title: "Analytics", spoils: "20 Spoils", image: "/categories/analytics.jpg" },
  { id: 4, title: "Marketing", spoils: "20 Spoils", image: "/categories/marketing.jpg" },
  { id: 5, title: "Branding", spoils: "20 Spoils", image: "/categories/branding.jpg" },
  { id: 6, title: "Business", spoils: "20 Spoils", image: "/categories/business.jpg" },
  { id: 7, title: "Health & Science", spoils: "20 Spoils", image: "/categories/health.jpg" },
  { id: 8, title: "Productivity", spoils: "20 Spoils", image: "/categories/productivity.jpg" },
];

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState("");
 const {
    data,
    isLoading,
    isError,
    categoryErrorMessage,
  } = useGetAllCategoriesQuery();

  /** Prepare API Categories */
  const apiCategories = useMemo(() => {
    return (
      data?.data?.map((s: any) => ({
        id: s.id,
        title: s.name || "Untitled",
        spoils: `${s.total_spoils || 0} Spoils`,
        image: s.url || "/categories/uiux.jpg",
      })) || []
    );
  }, [data]);

  const categories = apiCategories.length > 0 ? apiCategories : fallbackCategories;

  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <WebsiteSection className="my-8">
      <div className="flex flex-col gap-3 mb-6">
        <h2 className="text-2xl font-semibold">All Categories</h2>

        <div className="w-full sm:w-auto">
          <input
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 w-full sm:w-64 outline-none focus:ring-2 focus:ring-[#063B4A]"
          />
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-700">No categories found</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search term</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="relative rounded-2xl overflow-hidden h-52 cursor-pointer transform transition-transform hover:scale-105"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute bottom-3 left-3 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-black text-xs">
                    <Image src={Icon1} alt="icon" width={20} height={20} />
                  </span>
                </div>

                <h3 className="text-sm font-semibold truncate max-w-[120px]">
                  {cat.title}
                </h3>

                <p className="text-xs text-white/80">{cat.spoils}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </WebsiteSection>
  );
}