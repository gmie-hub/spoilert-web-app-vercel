"use client";


import AboutUsImage from "@spt/assets/images/aboutus3.svg";
import { useGetBookmarksQuery } from "@spt/hooks/apiRequests/useGetBookmarksQuery";

import BookmarkCard from "./BookmarkCard";


export default function MyBookmarksPage() {
  const { data: bookmarks, isLoading, isError } = useGetBookmarksQuery();
  const dummyBookmarks = [
    {
      title: "BCH 404- Biological Pharmacology",
      price: "₦15,000",
      author: "Ogunsola Omorinsola",
      image: AboutUsImage,
      isFree: false,
    },
    {
      title: "BCH 404- Biological Pharmacology",
      price: "Free",
      author: "Ogunsola Omorinsola",
      image: AboutUsImage,
      isFree: true,
    },
    {
      title: "Building Design Systems",
      price: "₦15,000",
      author: "Ogunsola Omorinsola",
      image: AboutUsImage,
      isFree: false,
    },
    {
      title: "Design System",
      price: "₦15,000",
      author: "Ogunsola Omorinsola",
      image: AboutUsImage,
      isFree: false,
    },
    {
      title: "What are Case Studies",
      price: "Free",
      author: "Ogunsola Omorinsola",
      image: AboutUsImage,
      isFree: true,
    },
    {
      title: "Branding",
      price: "₦15,000",
      author: "Ogunsola Omorinsola",
      image: AboutUsImage,
      isFree: false,
    },
  ];

  // Use backend data if available, otherwise fallback to dummy
  let bookmarkList = dummyBookmarks;
  if (bookmarks && Array.isArray(bookmarks) && bookmarks.length > 0) {
    bookmarkList = bookmarks;
  } else if (bookmarks?.data && Array.isArray(bookmarks.data) && bookmarks.data.length > 0) {
    bookmarkList = bookmarks.data;
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-6 text-[#20262D]">My Bookmarks</h2>
      {isLoading && <div>Loading bookmarks...</div>}
      {isError && <div>Failed to load bookmarks.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {bookmarkList?.length ? (
          bookmarkList.map((bookmark: any, idx: number) => (
            <BookmarkCard key={idx} {...bookmark} />
          ))
        ) : (
          !isLoading && <div className="col-span-2 text-gray-500">No bookmarks found.</div>
        )}
      </div>
    </div>
  );
}
