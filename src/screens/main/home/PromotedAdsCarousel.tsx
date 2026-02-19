"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";

import WebsiteSection from "@spt/components/websiteSection";
import { useGetInstitutionSpoilsQuery } from "@spt/hooks/apiRequests/useGetInstitutionSpoilsQuery";

const AUTO_SLIDE_INTERVAL = 4000;

const PromotedAdsCarousel = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  // fetch promoted spoils and render only endpoint results
  const { data } = useGetInstitutionSpoilsQuery();
  const items = data?.data?.data?.slice(0, 6)?.map((s: any) => ({
    id: s.id,
    src: s.cover_image_url,
    alt: s.title || "Promoted Ad",
  })) || [];

  // if API returned no items, don't render this section
  if (items.length === 0) return null;

  // slider ref used for auto sliding

  /** Scroll Next (not used directly - auto-slide handles movement) */

  /** Auto Slide (looping) */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
      const cardWidth = sliderRef.current.children[0]?.clientWidth || clientWidth;
      if (scrollLeft + clientWidth >= scrollWidth - 2) {
        // loop back to start
        sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        sliderRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <WebsiteSection className="my-14 w-full">
      <h2 className="text-xl font-semibold text-center mb-6">
        Promoted Ads
      </h2>

      <div className="relative">
        {/* SLIDER */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-2 scrollbar-hide"
        >
          {items.map((ad) => (
            <div
              key={ad.id}
              className="flex-shrink-0 relative overflow-hidden rounded-xl border border-gray-200 shadow-sm
                  h-36 sm:h-40 md:h-44
                  w-56 sm:w-56 md:w-64 lg:w-72"
            >
              <Image src={ad.src} alt={ad.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </WebsiteSection>
  );
};

export default PromotedAdsCarousel;
