"use client";

import React, { useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";


import Icon1 from "@spt/assets/icons/Icon(3).svg";
import SpoilCard from "@spt/components/spoilCard";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetAllCategoriesQuery } from "@spt/hooks/apiRequests/useGetAllCategoriesQuery";
import { useGetSpoilsByCategoryQuery } from "@spt/hooks/apiRequests/useGetSpoilsByCategoryQuery";

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [spoilSearch, setSpoilSearch] = useState("");
  const router = useRouter();


    const handleBack = () => {
    router.back();
  };

  const {
    data,
    isLoading,
    isError,
    categoryErrorMessage,
  } = useGetAllCategoriesQuery(undefined, searchTerm);

  const { data: spoilsData, isLoading: spoilsLoading } = useGetSpoilsByCategoryQuery(
    { category_id: selectedCategoryId, search: spoilSearch },
    selectedCategoryId !== null,
  );

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

  const selectedCategory = apiCategories.find((cat) => cat.id === selectedCategoryId);

  // Loading State
  if (isLoading) {
    return (
      <WebsiteSection className="my-8">
        <div className="flex flex-col gap-3 mb-6">
          <h2 className="text-2xl font-semibold">All Categories</h2>
          <div className="w-full sm:w-auto">
            <input
              placeholder="Search category..."
              disabled
              className="px-4 py-2 rounded-lg border border-gray-200 w-full sm:w-64 outline-none bg-gray-100"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden h-52 bg-gray-300 animate-pulse" />
          ))}
        </div>
      </WebsiteSection>
    );
  }

  // Error State
  if (isError) {
    return (
      <WebsiteSection className="my-8">
        <div className="flex flex-col gap-3 mb-6">
          <h2 className="text-2xl font-semibold">All Categories</h2>
        </div>
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <p className="text-lg font-semibold text-red-600">Error Loading Categories</p>
            <p className="text-sm text-gray-500 mt-2">
              {categoryErrorMessage || "Something went wrong. Please try again later."}
            </p>
          </div>
        </div>
      </WebsiteSection>
    );
  }

  // Selected category — show its spoils
  if (selectedCategoryId !== null) {
    return (
      <WebsiteSection className="my-8">
        <div className=" mb-6">
        
           <button
            onClick={() => { setSelectedCategoryId(null); setSpoilSearch(""); }}
            className="px-4 py-2 hover:bg-gray-300 text-[#013B4D] text-[16px] font-medium transition-colors whitespace-nowrap"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-semibold">
            {selectedCategory?.title} Spoils
          </h2>
        
        </div>

        <div className="mb-6">
          <input
            placeholder="Search spoils..."
            value={spoilSearch}
            onChange={(e) => setSpoilSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 w-full sm:w-80 outline-none focus:ring-2 focus:ring-[#063B4A]"
          />
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
          <div className="flex items-center justify-center h-64 text-center">
            <p className="text-gray-500">No spoils found in this category.</p>
          </div>
        )}
      </WebsiteSection>
    );
  }

  return (
    <WebsiteSection className="my-8">
         <button
            onClick={handleBack}
            className="px-4 py-2 hover:bg-gray-300 text-[#013B4D] text-[16px] font-medium transition-colors whitespace-nowrap cursor-pointer mb-4"
          >
            ← Back
          </button>
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

      {apiCategories.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-700">No categories found</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search term</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {apiCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryId(cat.id)}
              className="relative rounded-2xl overflow-hidden h-52 cursor-pointer transform transition-transform hover:scale-105 text-left"
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
            </button>
          ))}
        </div>
      )}
    </WebsiteSection>
  );
}
