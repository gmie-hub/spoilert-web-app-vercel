"use client";

import Image from "next/image";

import AuthorIcon from "@spt/assets/icons/author.svg";
import BanchIcon from "@spt/assets/icons/banchMarks.svg";
import DeleteIcon from "@spt/assets/icons/deleteIconbanch.svg";

interface BookmarkCardProps {
  title: string;
  price: string;
  author: string;
  image: string;
  isFree?: boolean;
}

export default function BookmarkCard({
  title,
  price,
  author,
  image,
  isFree,
}: BookmarkCardProps) {
  return (
    <div className="flex bg-white rounded-[12px] shadow-sm p-4 gap-4 items-center min-h-[120px] relative group hover:shadow-md transition border border-[#F6F4F0] shadow-[#D4A4371A]">
      <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={title}
          width={117}
          height={121}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className=" text-[16px] text-[#212529] truncate pr-2 leading-snug">
            {title}
          </h3>
          <Image
            className="text-[#F35B5B] hover:bg-[#F35B5B]/10 rounded-lg  transition border border-[#F6F4F0]"
            src={DeleteIcon}
            alt="DeleteIcon"
            width={32}
            height={32}
          />
        </div>
        <div className="mt-2 flex items-center gap-2">
          {!isFree ? (
            <span className="[text-[#212529] font-semibold text-[16px]">{price}</span>
          ) : (
            <span className="bg-[#EAFFEF] text-[#1CC8A5] text-xs font-medium rounded-[8px] px-2 py-0.5">
              Free
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[#666869] text-[14px] ">
          <span className="inline-flex items-center">
            <Image src={AuthorIcon} alt="Author Icon" width={20} height={20} className="mr-1" />
          </span>
          {author}
        </div>
      </div>
      <Image
        className="absolute top-6 left-25  hover:bg-[#003049] hover:text-white transition -translate-x-1/2"
        src={BanchIcon}
        alt="BanchIcon"
        width={32}
        height={32}
      />
    </div>
  );
}
