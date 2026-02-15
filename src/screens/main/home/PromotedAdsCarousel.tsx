"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";

import WebsiteSection from "@spt/components/websiteSection";

const ads = [
  { id: 1, src: "/ads/ad1.jpg", alt: "Ad 1" },
  { id: 2, src: "/ads/ad2.jpg", alt: "Ad 2" },
  { id: 3, src: "/ads/ad3.jpg", alt: "Ad 3" },
  { id: 4, src: "/ads/ad4.jpg", alt: "Ad 4" },
  { id: 5, src: "/ads/ad1.jpg", alt: "Ad 5" },
  { id: 6, src: "/ads/ad2.jpg", alt: "Ad 6" },
];

const AUTO_SLIDE_INTERVAL = 4000;

const PromotedAdsCarousel = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

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
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="flex-shrink-0 relative overflow-hidden rounded-xl border border-gray-200 shadow-sm
                  h-36 sm:h-40 md:h-44
                  w-56 sm:w-56 md:w-64 lg:w-72"
              
            >
              <Image
                src={ad.src}
                alt={ad.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </WebsiteSection>
  );
};

export default PromotedAdsCarousel;
