"use client";

import React, { useMemo, useState } from "react";

import Image from "next/image";

import Icon1 from "@spt/assets/icons/Icon(3).svg";
import SpoilCard from "@spt/components/spoilCard";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetAllCategoriesQuery } from "@spt/hooks/apiRequests/useGetAllCategoriesQuery";
import { useGetSpoilsByCategoryQuery } from "@spt/hooks/apiRequests/useGetSpoilsByCategoryQuery";

export default function SpoilInCategories() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading: categoriesLoading } = useGetAllCategoriesQuery();

  const { data: spoilsData, isLoading: spoilsLoading } = useGetSpoilsByCategoryQuery(
    { category_id: selectedCategory, search: searchQuery },
    selectedCategory !== null,
  );

  const categories = useMemo(() => {
    return (
      data?.data?.map((s: any) => ({
        id: s.id,
        title: s.name || "Untitled",
        spoils: `${s.total_spoils || 0} Spoils`,
        image: s.url || "/categories/uiux.jpg",
      })) || []
    );
  }, [data]);

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);

  // const handleClear = () => {
  //   setSelectedCategory(null);
  //   setSearchQuery("");
  // };

  // If a category is selected, show the spoils
  if (selectedCategory) {
    return (
      <WebsiteSection className="my-8">
          
        <div className="flex flex-col gap-3 mb-6">
          <div className="">
            
            <h2 className="text-2xl font-semibold">
              {selectedCategoryData?.title} Spoils
            </h2>
          
          </div>

          <div className="w-full sm:w-auto">
            <input
              placeholder="Search spoils..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 w-full sm:w-80 outline-none focus:ring-2 focus:ring-[#063B4A]"
            />
          </div>
        </div>

        {spoilsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl h-52 bg-gray-300 animate-pulse" />
            ))}
          </div>
        ) : spoilsData?.data?.data && spoilsData.data.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {spoilsData.data.data.map((spoil) => (
              <SpoilCard key={spoil.id} spoil={spoil} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">No spoils found in this category.</p>
          </div>
        )}
      </WebsiteSection>
    );
  }

  // Show category cards
  return (
    <WebsiteSection className="my-8">
      <div className="flex flex-col gap-3 mb-6">
        <h2 className="text-2xl font-semibold">Browse Categories</h2>
      </div>

      {categoriesLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden h-52 bg-gray-300 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="relative rounded-2xl overflow-hidden h-52 cursor-pointer hover:ring-2 hover:ring-[#063B4A] transition-all"
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
      )}
    </WebsiteSection>
  );
}
