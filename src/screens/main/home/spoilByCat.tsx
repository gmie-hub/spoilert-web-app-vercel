"use client";

import { useEffect, useMemo, useRef } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Icon1 from "@spt/assets/icons/Icon(3).svg";
import Button from "@spt/components/button";
import WebsiteSection from "@spt/components/websiteSection";
import { useGetAllCategoriesQuery } from "@spt/hooks/apiRequests/useGetAllCategoriesQuery";

import { LoadingState } from "../spoil/startSpoilStates";

import { ErrorState } from "./spoilDetails/spoilDetails";

const AUTO_SLIDE_INTERVAL = 4000;

const SpoilByCategory = () => {
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, categoryErrorMessage } =
    useGetAllCategoriesQuery();

  /** Prepare API Categories Safely */
  const apiCategories = useMemo(() => {
    return (
      data?.data?.slice(0, 10)?.map((s: any) => ({
        id: s.id,
        title: s.name || "Untitled",
        spoils: `${s.total_spoils || 0} Spoylz`,
        image: s.url || "/categories/uiux.jpg",
      })) || []
    );
  }, [data]);

  /* Use API categories directly */
  const items = apiCategories;

  /** Auto Slide */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!sliderRef.current || sliderRef.current.children.length === 0) return;

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
    <>
      {items &&items?.length > 0 && (
        <WebsiteSection className="my-14 w-full">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 sm:gap-0">
            <h2 className="text-xl font-semibold">Spoylz By Categories</h2>
            <Button
              onClick={() => router.push("/categories")}
              type="submit"
              className="w-full text-[16px] sm:w-auto"
            >
              View All Categories
            </Button>
          </div>

          {/* LOADING STATE */}
          {isLoading && <LoadingState />}

          {/* ERROR STATE */}
          {isError && categoryErrorMessage && (
            <ErrorState message={categoryErrorMessage} />
          )}

          {/* SLIDER */}
          {!isLoading && !isError && items.length > 0 && (
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
          )}

          {/* EMPTY STATE */}
          {!isLoading && !isError && items.length === 0 && (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-500">No categories available</p>
            </div>
          )}
        </WebsiteSection>
      )}
    </>
  );
};

export default SpoilByCategory;
