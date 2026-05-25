"use client";

import { useGetBookmarksQuery } from "@spt/hooks/apiRequests/useGetBookmarksQuery";

import { ErrorState } from "../../home/spoilDetails/spoilDetails";
import { LoadingState } from "../../spoil/preSpoilQuiz/components/LoadingState";

import BookmarkCard from "./BookmarkCard";

export default function MyBookmarksPage() {
  const { data: bookmarks, isLoading, isError, errorMessage } = useGetBookmarksQuery();

  // Normalize data
  let bookmarkList = [];

  if (Array.isArray(bookmarks) && bookmarks.length > 0) {
    bookmarkList = bookmarks;
  } else if (Array.isArray(bookmarks?.data) && bookmarks.data.length > 0) {
    bookmarkList = bookmarks.data;
  }

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
            bookmarkList.map((bookmark: any, idx: number) => (
              <BookmarkCard key={idx} {...bookmark} />
            ))
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