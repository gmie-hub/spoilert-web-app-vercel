"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";

import Icon1 from "@spt/assets/icons/Icon(3).svg";
import Button from "@spt/components/button";
import WebsiteSection from "@spt/components/websiteSection";

const categories = [
  {
    id: 1,
    title: "UI/UX Design",
    spoils: "20 Spoils",
    image: "/categories/uiux.jpg",
  },
  {
    id: 2,
    title: "Software Development",
    spoils: "20 Spoils",
    image: "/categories/software.jpg",
  },
  {
    id: 3,
    title: "Finance",
    spoils: "20 Spoils",
    image: "/categories/finance.jpg",
  },
  {
    id: 4,
    title: "Finance",
    spoils: "20 Spoils",
    image: "/categories/finance.jpg",
  },
  {
    id: 5,
    title: "Finance",
    spoils: "20 Spoils",
    image: "/categories/finance.jpg",
  },
  {
    id: 6,
    title: "Finance",
    spoils: "20 Spoils",
    image: "/categories/finance.jpg",
  },
];

const AUTO_SLIDE_INTERVAL = 4000;

const SpoilByCategory = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  /** Auto Slide */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!sliderRef.current) return;

      const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
      const cardWidth =
        sliderRef.current.children[0]?.clientWidth || clientWidth;

      if (scrollLeft + clientWidth >= scrollWidth - 2) {
        sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        sliderRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <WebsiteSection className="my-14 w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 sm:gap-0">
        <h2 className="text-xl font-semibold">Spoils By Categories</h2>
        <Button type="submit" className="w-full sm:w-auto">View All Categories</Button>
      </div>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scroll-smooth px-2 scrollbar-hide"
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="relative flex-shrink-0 overflow-hidden rounded-2xl
              h-36 sm:h-40 md:h-44
              w-56 sm:w-60 md:w-64 lg:w-72"
          >
            {/* IMAGE */}
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover"
            />

            {/* DARK OVERLAY GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* TEXT INSIDE IMAGE */}
            <div className="absolute bottom-3 left-3 text-white">
              <div className="flex items-center gap-2 mb-1">
                {/* Small Icon Badge */}
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/90 text-black text-xs">
                  <Image src={Icon1} alt="icon" width={32} height={32} />
                </span>

                {/* Title */}
                <h3 className="text-sm font-semibold">{cat.title}</h3>
              </div>

              {/* Spoils Count */}
              <p className="text-xs text-white/80">{cat.spoils}</p>
            </div>
          </div>
        ))}
      </div>
    </WebsiteSection>
  );
};

export default SpoilByCategory;
