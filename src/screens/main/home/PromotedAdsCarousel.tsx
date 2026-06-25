"use client";

import React, { useEffect, useMemo, useRef } from "react";

import Image from "next/image";

import WebsiteSection from "@spt/components/websiteSection";
import { type Ad, useGetActiveAdsQuery } from "@spt/hooks/apiRequests/useGetActiveAdsQuery";

const AUTO_SLIDE_INTERVAL = 4000;

const PromotedAdsCarousel = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, errorMessage } = useGetActiveAdsQuery();
  /* ==c============================
     Prepare API Items
  ============================== */
  const items = useMemo(() => {
    const raw = data?.data;
    const ads: Ad[] = Array.isArray(raw)
      ? raw
      : Array.isArray((raw as { data?: unknown })?.data)
        ? (raw as { data: Ad[] }).data
        : [];
    return ads.map((s) => ({
      id: s.id,
      src: s.image_url,
      alt: s.title || "Promoted Ad",
      url: s.url ?? null,
    }));
  }, [data]);

  /* ==============================
     Auto Slide
  ============================== */
  useEffect(() => {
    if (!sliderRef.current || items.length === 0) return;

    const interval = setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const { scrollLeft, clientWidth, scrollWidth } = slider;
      const firstChild = slider.children[0] as HTMLElement | undefined;
      const cardWidth = firstChild?.clientWidth || clientWidth;

      if (scrollLeft + clientWidth >= scrollWidth - 2) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [items]);

  /* ==============================
     Loading State
  ============================== */
  if (isLoading) {
    return (
      <>{items && items.length > 0 && (
      <WebsiteSection className="my-14 w-full">
        <h2 className="text-[16px] sm:text-[40px] font-semibold text-center mb-6">
          Promoted Ads
        </h2>

        <div className="flex gap-4 overflow-x-auto px-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 animate-pulse bg-gray-200 rounded-xl 
                h-36 sm:h-40 md:h-44 
                w-56 sm:w-56 md:w-64 lg:w-72"
            />
          ))}
        </div>
      </WebsiteSection>)}</>
    );
  }

  /* ==============================
     Error State
  ============================== */
  if (isError) {
    return (
      <WebsiteSection className="my-14 w-full">
        <h2 className="text-xl font-semibold text-center mb-6">Promoted Ads</h2>
        <div className="text-center text-sm text-red-600">
          {errorMessage || "Failed to load promoted ads."}
        </div>
      </WebsiteSection>
    );
  }

  if (items.length === 0) return null;

  /* ==============================
     Main Render
  ============================== */
  return (
    <WebsiteSection className="my-14 w-full">
      <h2 className="text-xl font-semibold text-center mb-6">Promoted Ads</h2>

      <div className="relative">
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-2 scrollbar-hide"
        >
          {items.map((ad, index) => {
            const inner = (
              <div
                className="flex-shrink-0 relative overflow-hidden rounded-xl border border-gray-200 shadow-sm
                  h-36 sm:h-40 md:h-44
                  w-56 sm:w-56 md:w-64 lg:w-72"
              >
                <Image src={ad.src} alt={ad.alt} fill className="object-cover" />
              </div>
            );

            return ad.url ? (
              <a
                key={`${ad.id}-${index}`}
                href={ad.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0"
              >
                {inner}
              </a>
            ) : (
              <React.Fragment key={`${ad.id}-${index}`}>{inner}</React.Fragment>
            );
          })}
        </div>
      </div>
    </WebsiteSection>
  );
};

export default PromotedAdsCarousel;
