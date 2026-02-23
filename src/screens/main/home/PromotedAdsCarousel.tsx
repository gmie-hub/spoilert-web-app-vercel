// "use client";

// import { useEffect, useRef } from "react";

// import Image from "next/image";

// import WebsiteSection from "@spt/components/websiteSection";
// import { useGetInstitutionSpoilsQuery } from "@spt/hooks/apiRequests/useGetInstitutionSpoilsQuery";

// const AUTO_SLIDE_INTERVAL = 4000;

// const PromotedAdsCarousel = () => {
//   const sliderRef = useRef<HTMLDivElement>(null);

//   // fetch promoted spoils and render only endpoint results
//   const { data, isLoading, isError, errorMessage } = useGetInstitutionSpoilsQuery();
//   const items = data?.data?.data?.slice(0, 6)?.map((s: any) => ({
//     id: s.id,
//     src: s.cover_image_url,
//     alt: s.title || "Promoted Ad",
//   })) || [];
//   /** Auto Slide (looping) */
//   useEffect(() => {
//     // only start auto-slide when we have a rendered slider with children
//     if (!sliderRef.current || sliderRef.current.children.length === 0) return;

//     const interval = setInterval(() => {
//       const slider = sliderRef.current;
//       if (!slider || slider.children.length === 0) return;

//       const { scrollLeft, clientWidth, scrollWidth } = slider;
//       const firstChild = slider.children[0] as HTMLElement | undefined;
//       const cardWidth = firstChild?.clientWidth || clientWidth;

//       // guard scroll methods (some environments may not implement them)
//       const canScrollTo = typeof slider.scrollTo === "function";
//       const canScrollBy = typeof (slider as any).scrollBy === "function";

//       if (scrollLeft + clientWidth >= scrollWidth - 2) {
//         if (canScrollTo) slider.scrollTo({ left: 0, behavior: "smooth" });
//       } else {
//         if (canScrollBy) (slider as any).scrollBy({ left: cardWidth, behavior: "smooth" });
//       }
//     }, AUTO_SLIDE_INTERVAL);

//     return () => clearInterval(interval);
//   }, [items]);

//   // Loading state: show skeleton cards
//   if (isLoading) {
//     return (
//       <WebsiteSection className="my-14 w-full">
//         <h2 className="text-xl font-semibold text-center mb-6">Promoted Ads</h2>
//         <div className="flex gap-4 overflow-x-auto px-2">
//           {Array?.from({ length: 6 })?.map((_, i) => (
//             <div
//               key={i}
//               className="flex-shrink-0 animate-pulse bg-gray-200 rounded-xl h-36 sm:h-40 md:h-44 w-56 sm:w-56 md:w-64 lg:w-72"
//             />
//           ))}
//         </div>
//       </WebsiteSection>
//     );
//   }

//   // Error state: show a simple message
//   if (isError) {
//     return (
//       <WebsiteSection className="my-14 w-full">
//         <h2 className="text-xl font-semibold text-center mb-6">Promoted Ads</h2>
//         <div className="text-center text-sm text-red-600">{errorMessage || "Failed to load promoted ads."}</div>
//       </WebsiteSection>
//     );
//   }

//   // if API returned no items, don't render this section
//   if (items.length === 0) return null;

//   // slider ref used for auto sliding

//   return (
//     <WebsiteSection className="my-14 w-full">
//       <h2 className="text-xl font-semibold text-center mb-6">
//         Promoted Ads
//       </h2>

//       <div className="relative">
//         {/* SLIDER */}
//         <div
//           ref={sliderRef}
//           className="flex gap-4 overflow-x-auto scroll-smooth px-2 scrollbar-hide"
//         >
//           {items?.map((ad) => (
//             <div
//               key={ad.id}
//               className="flex-shrink-0 relative overflow-hidden rounded-xl border border-gray-200 shadow-sm
//                   h-36 sm:h-40 md:h-44
//                   w-56 sm:w-56 md:w-64 lg:w-72"
//             >
//               <Image src={ad.src} alt={ad.alt} fill className="object-cover" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </WebsiteSection>
//   );
// };

// export default PromotedAdsCarousel;

"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";

import WebsiteSection from "@spt/components/websiteSection";
import { useGetInstitutionSpoilsQuery } from "@spt/hooks/apiRequests/useGetInstitutionSpoilsQuery";

const AUTO_SLIDE_INTERVAL = 4000;

const PromotedAdsCarousel = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, errorMessage } =
    useGetInstitutionSpoilsQuery();

  /* ==============================
     Prepare API Items
  ============================== */
  const apiItems =
    data?.data?.data?.slice(0, 6)?.map((s: any) => ({
      id: s.id,
      src: s.cover_image_url,
      alt: s.title || "Promoted Ad",
    })) || [];

  /* Use API items directly */
  const items = apiItems;

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
      </WebsiteSection>
    );
  }

  /* ==============================
     Error State
  ============================== */
  if (isError) {
    return (
      <WebsiteSection className="my-14 w-full">
        <h2 className="text-xl font-semibold text-center mb-6">
          Promoted Ads
        </h2>
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
      <h2 className="text-xl font-semibold text-center mb-6">
        Promoted Ads
      </h2>

      <div className="relative">
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-2 scrollbar-hide"
        >
          {items.map((ad, index) => (
            <div
              key={`${ad.id}-${index}`}
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