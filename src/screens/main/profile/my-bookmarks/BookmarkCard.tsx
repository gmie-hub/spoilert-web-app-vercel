"use client";

import Image from "next/image";
import {FiBookmark, FiTrash2 } from "react-icons/fi";

interface BookmarkCardProps {
  title: string;
  price: string;
  author: string;
  image: string;
  isFree?: boolean;
}

export default function BookmarkCard({ title, price, author, image, isFree }: BookmarkCardProps) {
  return (
    <div className="flex bg-white rounded-2xl shadow-sm p-4 gap-4 items-center min-h-[120px] relative group hover:shadow-md transition border border-[#F6F4F0]">
      <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={title}
          width={112}
          height={112}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-[#20262D] truncate pr-2 leading-snug">
            {title}
          </h3>
          <button className="text-[#F35B5B] hover:bg-[#F35B5B]/10 rounded-lg p-2 transition border border-[#F6F4F0]">
            <FiTrash2 size={20} />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          {!isFree ? (
            <span className="text-[#20262D] font-bold text-lg">{price}</span>
          ) : (
            <span className="bg-[#E6FAF7] text-[#1CC8A5] text-xs font-medium rounded px-2 py-0.5">Free</span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[#8A98A3] text-base font-normal">
          <span className="inline-flex items-center">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="10" fill="#E6F4F7" />
              <path d="M10 10.8333C11.3807 10.8333 12.5 9.71405 12.5 8.33333C12.5 6.95262 11.3807 5.83333 10 5.83333C8.61929 5.83333 7.5 6.95262 7.5 8.33333C7.5 9.71405 8.61929 10.8333 10 10.8333Z" stroke="#8A98A3" strokeWidth="1.2" />
              <path d="M5.83325 14.1667C5.83325 12.3182 7.48477 10.8333 9.99992 10.8333C12.5151 10.8333 14.1666 12.3182 14.1666 14.1667" stroke="#8A98A3" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </span>
          {author}
        </div>
      </div>
      <button className="absolute top-4 left-20 bg-white rounded-full p-2 shadow-sm border border-[#E9EEF2] text-[#003049] hover:bg-[#003049] hover:text-white transition -translate-x-1/2">
        <FiBookmark size={22} />
      </button>
    </div>
  );
}
