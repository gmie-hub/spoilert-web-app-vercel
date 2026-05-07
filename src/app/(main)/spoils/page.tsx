"use client";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import SpoilCard from "@spt/components/spoilCard";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetSpoilsByCategoryQuery } from "@spt/hooks/apiRequests/useGetSpoilsByCategoryQuery";

export default function CategorySpoilsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryId = searchParams.get("category");
  const [searchQuery, setSearchQuery] = React.useState("");

  const categoryIdNum = categoryId ? parseInt(categoryId, 10) : null;

  const { data: spoilsData, isLoading, error } = useGetSpoilsByCategoryQuery(
    { category_id: categoryIdNum },
    categoryIdNum !== null
  );

  // Filter spoils based on search query
  const filteredSpoils = React.useMemo(() => {
    if (!spoilsData?.data) return [];
    if (!searchQuery) return spoilsData.data;
    return spoilsData.data.filter(
      (spoil) =>
        spoil.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spoil.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [spoilsData?.data, searchQuery]);

  const handleBack = () => {
    router.back();
  };

  // Error state - no category ID
  if (!categoryId) {
    return (
      <WebsiteSection className="my-8">
        <div className="flex flex-col gap-3 mb-6">
          <h2 className="text-2xl font-semibold">Category Not Found</h2>
          <p className="text-gray-600">No category selected.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-lg bg-[#063B4A] text-white font-medium w-fit hover:bg-[#052f39] transition-colors"
          >
            Go Back
          </button>
        </div>
      </WebsiteSection>
    );
  }

  return (
    <WebsiteSection className="my-8">
      {/* Header Section */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-3xl font-semibold text-gray-900">Category Spoils</h2>
            <p className="text-sm text-gray-600 mt-1">
              {isLoading
                ? "Loading spoils..."
                : filteredSpoils.length > 0
                  ? `Showing ${filteredSpoils.length} spoil${
                      filteredSpoils.length !== 1 ? "s" : ""
                    }`
                  : "No spoils found"}
            </p>
          </div>
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors whitespace-nowrap"
          >
            ← Back
          </button>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-auto">
          <input
            placeholder="Search spoils..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-gray-200 w-full sm:w-96 outline-none focus:ring-2 focus:ring-[#063B4A] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#063B4A] mb-4" />
          <p className="text-gray-500">Loading spoils...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <p className="text-lg font-semibold text-red-600">Error Loading Spoils</p>
            <p className="text-sm text-gray-500 mt-2">
              {(error as any)?.message || "Something went wrong. Please try again."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded-lg bg-[#063B4A] text-white font-medium hover:bg-[#052f39] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : filteredSpoils.length === 0 && searchQuery ? (
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-700">No spoils found</p>
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your search or browse other categories
            </p>
          </div>
        </div>
      ) : filteredSpoils.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-700">
              No spoils in this category
            </p>
            <p className="text-sm text-gray-500 mt-2">Check back later for new content</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSpoils.map((spoil) => (
            <SpoilCard key={spoil.id} spoil={spoil} />
          ))}
        </div>
      )}
    </WebsiteSection>
  );
}
