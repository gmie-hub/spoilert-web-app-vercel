"use client";


import BookmarkCard from "./BookmarkCard";

const bookmarks = [
  {
    title: "BCH 404- Biological Pharmacology",
    price: "₦15,000",
    author: "Ogunsola Omorinsola",
    image: "/assets/images/sample-course.jpg",
    isFree: false,
  },
  {
    title: "BCH 404- Biological Pharmacology",
    price: "Free",
    author: "Ogunsola Omorinsola",
    image: "/assets/images/sample-course.jpg",
    isFree: true,
  },
  {
    title: "Building Design Systems",
    price: "₦15,000",
    author: "Ogunsola Omorinsola",
    image: "/assets/images/sample-course.jpg",
    isFree: false,
  },
  {
    title: "Design System",
    price: "₦15,000",
    author: "Ogunsola Omorinsola",
    image: "/assets/images/sample-course.jpg",
    isFree: false,
  },
  {
    title: "What are Case Studies",
    price: "Free",
    author: "Ogunsola Omorinsola",
    image: "/assets/images/sample-course.jpg",
    isFree: true,
  },
  {
    title: "Branding",
    price: "₦15,000",
    author: "Ogunsola Omorinsola",
    image: "/assets/images/sample-course.jpg",
    isFree: false,
  },
];

export default function MyBookmarksPage() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-6 text-[#20262D]">My Bookmarks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {bookmarks.map((bookmark, idx) => (
          <BookmarkCard key={idx} {...bookmark} />
        ))}
      </div>
    </div>
  );
}
