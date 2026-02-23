// "use client";

// import { useEffect, useRef } from "react";

// import Image from "next/image";

// import Icon1 from "@spt/assets/icons/Icon(3).svg";
// import Button from "@spt/components/button";
// import WebsiteSection from "@spt/components/websiteSection";
// import { useGetInstitutionSpoilsQuery } from "@spt/hooks/apiRequests/useGetInstitutionSpoilsQuery";



// const AUTO_SLIDE_INTERVAL = 4000;

// const SpoilByCategory = () => {
//   const sliderRef = useRef<HTMLDivElement>(null);

//   // Call institution spoils endpoint and use results if available
//   const { data } = useGetInstitutionSpoilsQuery();
//   const apiCategories = data?.data?.data?.slice(0, 6)?.map((s: any) => ({
//     id: s.id,
//     title: s.title || "Untitled",
//     spoils: `${s.ratings_count || 0} Spoils`,
//     image: s.cover_image_url || "/categories/uiux.jpg",
//   }));
//   const items = apiCategories && apiCategories.length > 0 ? apiCategories : [];

//   /** Auto Slide */
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!sliderRef.current) return;

//       const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
//       const cardWidth =
//         sliderRef.current.children[0]?.clientWidth || clientWidth;

//       if (scrollLeft + clientWidth >= scrollWidth - 2) {
//         sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
//       } else {
//         sliderRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
//       }
//     }, AUTO_SLIDE_INTERVAL);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <WebsiteSection className="my-14 w-full">
//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 sm:gap-0">
//         <h2 className="text-xl font-semibold">Spoils By Categories</h2>
//         <Button type="submit" className="w-full sm:w-auto">View All Categories</Button>
//       </div>

//       {/* SLIDER */}
//       <div
//         ref={sliderRef}
//         className="flex gap-4 overflow-x-auto scroll-smooth px-2 scrollbar-hide"
//       >
//         {items?.map((cat) => (
//           <div
//             key={cat.id}
//             className="relative flex-shrink-0 overflow-hidden rounded-2xl
//               h-36 sm:h-40 md:h-44
//               w-56 sm:w-60 md:w-64 lg:w-72"
//           >
//             {/* IMAGE */}
//             <Image
//               src={cat.image}
//               alt={cat.title}
//               fill
//               className="object-cover"
//             />

//             {/* DARK OVERLAY GRADIENT */}
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

//             {/* TEXT INSIDE IMAGE */}
//             <div className="absolute bottom-3 left-3 text-white">
//               <div className="flex items-center gap-2 mb-1">
//                 {/* Small Icon Badge */}
//                 <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/90 text-black text-xs">
//                   <Image src={Icon1} alt="icon" width={32} height={32} />
//                 </span>

//                 {/* Title */}
//                 <h3 className="text-sm font-semibold">{cat.title}</h3>
//               </div>

//               {/* Spoils Count */}
//               <p className="text-xs text-white/80">{cat.spoils}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </WebsiteSection>
//   );
// };

// export default SpoilByCategory;

"use client";

import { useEffect, useMemo, useRef } from "react";

import Image from "next/image";

import Icon1 from "@spt/assets/icons/Icon(3).svg";
import Button from "@spt/components/button";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetInstitutionSpoilsQuery } from "@spt/hooks/apiRequests/useGetInstitutionSpoilsQuery";

const AUTO_SLIDE_INTERVAL = 4000;

const SpoilByCategory = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const { data } = useGetInstitutionSpoilsQuery();

  /** Prepare API Categories Safely */
  const apiCategories = useMemo(() => {
    return (
      data?.data?.data?.slice(0, 10)?.map((s: any) => ({
        id: s.id,
        title: s.title || "Untitled",
        spoils: `${s.ratings_count || 0} Spoils`,
        image: s.cover_image_url || "/categories/uiux.jpg",
      })) || []
    );
  }, [data]);

  /* Use API categories directly */
  const items = apiCategories;

  /** Auto Slide */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!sliderRef.current || sliderRef.current.children.length === 0)
        return;

      const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;

      const firstChild = sliderRef.current.children[0] as HTMLElement;
      const cardWidth = firstChild?.clientWidth || clientWidth;

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
        <Button type="submit" className="w-full sm:w-auto">
          View All Categories
        </Button>
      </div>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scroll-smooth px-2 scrollbar-hide"
      >
        {items.map((cat) => (
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
              sizes="(max-width: 768px) 224px, 288px"
              className="object-cover"
            />

            {/* DARK OVERLAY GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* TEXT */}
            <div className="absolute bottom-3 left-3 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/90 text-black text-xs">
                  <Image src={Icon1} alt="icon" width={16} height={16} />
                </span>

                <h3 className="text-sm font-semibold truncate max-w-[140px]">
                  {cat.title}
                </h3>
              </div>

              <p className="text-xs text-white/80">{cat.spoils}</p>
            </div>
          </div>
        ))}
      </div>
    </WebsiteSection>
  );
};

export default SpoilByCategory;