"use client";

import { useGetBookmarksQuery } from "@spt/hooks/apiRequests/useGetBookmarksQuery";

import { ErrorState } from "../../home/spoilDetails/spoilDetails";
import { LoadingState } from "../../spoil/preSpoilQuiz/components/LoadingState";

import BookmarkCard from "./BookmarkCard";

export default function MyBookmarksPage() {
  const { data: bookmarks, isLoading, isError, errorMessage } = useGetBookmarksQuery();

  // Normalize data
  const bookmarkList = bookmarks?.data?.data || [];

  return (
    <div className="p-6">
      <h2 className="mb-6 text-lg font-semibold text-[#20262D]">
        My Bookmarks
      </h2>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message={errorMessage} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {bookmarkList.length > 0 ? (
            bookmarkList.map((bookmark: any) => {
              const spoil = bookmark.spoil;
              const tutor = spoil?.tutor;
              const author =
                tutor?.display_name ||
                `${tutor?.first_name ?? ""} ${tutor?.last_name ?? ""}`.trim();

              return (
                <BookmarkCard
                  key={bookmark.id}
                  spoilId={spoil?.id ?? bookmark.spoil_id}
                  title={spoil?.title}
                  image={spoil?.cover_image_url}
                  author={author}
                  isFree={spoil?.pricing === "free"}
                  price={`₦${Number(
                    spoil?.display_amount ?? spoil?.amount ?? 0
                  ).toLocaleString()}`}
                />
              );
            })
          ) : (
            <div className="col-span-2 text-gray-500">
              No bookmarks found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}