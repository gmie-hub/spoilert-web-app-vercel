"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import RatingIcon from "@spt/assets/icons/star.svg";
import PolyIcon from "@spt/assets/icons/Polygon 1.svg";
import Orange from "@spt/assets/icons/orange-arrow-right.svg";

import StarWhitecon from "@spt/assets/icons/star.svg";

import Tabs from "../../../../components/tabs";

const sampleDescription = `Understanding Design principles is a comprehensive Spoil...`; // truncated for brevity

const learnItems = [
  "How to identify the X principles of design.",
  "Understanding balance, contrast, and hierarchy in design",
  "The role of typography in effective communication",
  "How to use color theory to evoke emotions.",
  "Designing user-friendly interfaces.",
];

const reviews = [
  {
    id: 1,
    name: "Omorinsola Ogunsola",
    rating: 4,
    text: "I totally like the Spoil. It was simple and well easy...",
    date: "10/01/2025",
    time: "11:40am",
  },
  {
    id: 2,
    name: "Omorinsola Ogunsola",
    rating: 4,
    text: "I totally like the Spoil. It was simple and well easy...",
    date: "10/01/2025",
    time: "11:40am",
  },
  {
    id: 3,
    name: "Omorinsola Ogunsola",
    rating: 4,
    text: "I totally like the Spoil. It was simple and well easy...",
    date: "10/01/2025",
    time: "11:40am",
  },
];

const ReviewCard = ({ review }: { review: (typeof reviews)[0] }) => (
  <div className="bg-white rounded-lg p-4 border border-[#F3F3F3] shadow-[0_4px_14px_rgba(13,38,59,0.04)]">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
        <span className="text-xs text-gray-500">{review.name[0]}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{review.name}</span>
            <div className="flex items-center gap-1">
              {/* {Array.from({ length: 5 }).map((_, i) => (
                <RatingIcon key={i} filled={i < review.rating} />
                
              ))} */}
              {Array.from({ length: 5 }).map((_, i) => (
                <Image
                  key={i}
                  src={i < review.rating ? RatingIcon : StarWhitecon}
                  alt="rating"
                  width={20}
                  height={20}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-700 mt-3">{review.text}</p>
        <div className="text-xs text-gray-400 mt-3">
          {review.date} | {review.time}
        </div>
      </div>
    </div>
  </div>
);

export default function Details() {
  const [expanded, setExpanded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const overviewContent = (
    <div className="w-full">
      <div className="text-gray-700 text-sm leading-7 mb-4 max-w-[720px]">
        <p
          className={`transition-all duration-300 ${expanded ? "max-h-full" : "max-h-[8rem] overflow-hidden"}`}
        >
          {sampleDescription}
        </p>
        <button
          onClick={() => setExpanded((s) => !s)}
          className="mt-2 text-blue-600 text-sm font-medium flex items-center gap-2 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="#0B5FFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <h4 className="text-base font-semibold mt-6 mb-4">What you will learn</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
        {learnItems.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            {/* <span className="w-3 h-3 bg-blue-600 rotate-45 mt-2 inline-block" /> */}
            <Image src={PolyIcon} alt="rating" width={20} height={20} />

            <p className="text-gray-700 text-sm">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const outlineContent = (
    <div className="text-sm text-gray-600">
      Spoil outline content goes here. Replace with lessons or sections.
    </div>
  );

  const reviewsContent = (
    <div className="space-y-4">
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}
      <div className="mt-4 text-right">
        <a
          className="text-orange-500 font-medium inline-flex items-center gap-2 hover:underline"
          href="#"
        >
          See All Reviews
          <Image src={Orange} alt="rating" width={20} height={20} />
        </a>
      </div>
    </div>
  );

  const tabs = isSmallScreen
    ? [
        { label: "Overview", content: overviewContent },
        { label: "Spoil Outline", content: outlineContent },
        { label: "Reviews", content: reviewsContent },
      ]
    : [
        { label: "Overview", content: overviewContent },
        { label: "Spoil Outline", content: outlineContent },
      ];

  return (
    <section className="w-full mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 ">
          <Tabs tabs={tabs} />
        </div>
        {!isSmallScreen && (
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-[#F1F1F1] p-4">
              <h5 className="font-semibold text-sm mb-3">Reviews</h5>
              <div className="space-y-4">
                {reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
              <div className="mt-4 text-left">
                <a
                  className="text-orange-500 font-medium inline-flex items-center gap-2 hover:underline"
                  href="#"
                >
                  See All Reviews
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M13 5l7 7-7 7"
                      stroke="#F2994A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
