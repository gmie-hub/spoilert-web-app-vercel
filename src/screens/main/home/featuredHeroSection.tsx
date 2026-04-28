"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import HeroImage from "@spt/assets/icons/imageheor1.svg";
import HeroTwo from "@spt/assets/icons/imageheor2.svg";
import HeroThree from "@spt/assets/icons/imagehero3.svg";
import RatingIcon from "@spt/assets/icons/star.svg";
import UserIcon from "@spt/assets/icons/user.svg";
import Button from "@spt/components/button";
import { useGetAllSpoilsQuery } from "@spt/hooks/apiRequests/useGetAllSpoilsQuery";
import { useAuthStore } from "@spt/store/authStore";
import type { SpoilDatum } from "@spt/utils/spoils";

const FeaturedSpoilItem = ({ spoil }: { spoil: SpoilDatum }) => {
  const router = useRouter();
  const tutorName = [spoil.tutor?.first_name, spoil.tutor?.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      onClick={() => router.push(`/spoil-details/${spoil.id}`)}
      className="flex w-full items-start gap-4 rounded-[24px] bg-white p-4 text-left shadow-[0_18px_40px_rgba(8,55,72,0.08)] ring-1 ring-[#E8F1F5] transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(8,55,72,0.12)]"
    >
      <div className="relative h-[112px] w-[120px] shrink-0 overflow-hidden rounded-[18px] bg-[#EAF2F5]">
        <Image
          src={spoil.cover_image_url}
          alt={spoil.title}
          fill
          className="object-cover"
          sizes="120px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-[18px] font-medium leading-[1.25] text-[#20262D]">
          {spoil.title}
        </h3>

        <p className="mt-1 text-[16px] font-semibold text-[#20262D] md:text-[18px]">
          {spoil.pricing === "free"
            ? "Free"
            : `₦${(spoil.display_amount ?? spoil.amount ?? 0).toLocaleString()}`}
        </p>

        <div className="mt-2 flex items-center gap-2 text-[13px] text-[#6D7A86]">
          <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-[#EDF3F6]">
            {spoil.tutor?.avatar ? (
              <Image
                src={spoil.tutor.avatar}
                alt={tutorName || "Tutor"}
                fill
                className="object-cover"
                sizes="24px"
              />
            ) : (
              <Image
                src={UserIcon}
                alt="Tutor avatar placeholder"
                width={24}
                height={24}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <span className="truncate">{tutorName || "Spoilert Tutor"}</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex items-center gap-1 text-[13px] text-[#20262D]">
            <Image src={RatingIcon} alt="rating" width={16} height={16} />
            <span>
              {(spoil.average_rating ?? 0).toFixed(1)} (
              {spoil.ratings_count ?? 0})
            </span>
          </div>

          <span className="rounded-full bg-[#DFF2FB] px-3 py-1 text-[12px] font-medium text-[#0B5368]">
            {spoil.category?.name || "Featured"}
          </span>
        </div>
      </div>
    </button>
  );
};

const FeaturedHeroSection = () => {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const [activeSlide, setActiveSlide] = useState(0);
  const { data } = useGetAllSpoilsQuery({ visibility: "published" });
  const heroSlides = [HeroImage, HeroTwo, HeroThree];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const featuredSpoils = useMemo(() => {
    const spoils = data?.data?.data ?? [];
    return spoils.slice(0, 6);
  }, [data?.data?.data]);

  return (
    <section className="px-4 pb-4 pt-5 sm:px-6 lg:px-10 xl:px-[40px]">
      <div className="mx-auto grid max-w-[1400px] items-stretch gap-6 xl:grid-cols-[minmax(0,1.85fr)_420px]">
        <div className="flex flex-col rounded-[18px] border border-[#BFE4F2] bg-white px-6 py-6 shadow-[0_12px_32px_rgba(8,55,72,0.05)] sm:px-8 lg:px-6 xl:px-7">
          <div className="grid flex-1 items-center gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
            <div>
              <h1 className="max-w-[520px] text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#0B4156] sm:text-[42px] lg:text-[52px]">
                Learn,Teach,and
                <br />
                <span className="text-[#DB8845]">Earn Money.</span>
              </h1>

              <p className="pt-2 text-[#495057] text-[24px]">Explore spoils, publish your own, learn, and earn on Spoilert.</p>



              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button className="min-w-[172px] rounded-[14px] px-8 py-4 text-[16px] !bg-[#0C83A9] hover:!bg-[#0a6e8f]">
                  Download App
                </Button>
                {!authUser && (
                  <Button 
                    variant="blueOutline"
                    className="min-w-[172px] rounded-[14px] border-[#0B5368] px-8 py-4 text-[16px]"
                    onClick={() => router.push("/auth/signin")}
                  >
                    Get Started
                  </Button>
                )}
              </div>

              <div className="mt-6 flex items-center gap-3">
                {heroSlides.map((_, dotIndex) => (
                  <span
                    key={dotIndex}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveSlide(dotIndex)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        setActiveSlide(dotIndex);
                      }
                    }}
                    className={`block rounded-full ${
                      dotIndex === activeSlide
                        ? "h-3 w-3 bg-[#1B91B9]"
                        : "h-2.5 w-2.5 bg-[#C7D6DE]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="relative flex h-full flex-col overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#F4F9FB_0%,#E8F1F5_100%)] p-3 shadow-[0_18px_44px_rgba(8,55,72,0.09)]">
              <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-[18px]">
                {heroSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === activeSlide ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={slide}
                      alt="Learn, teach, and earn illustration"
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="flex max-h-[500px] flex-col overflow-hidden rounded-[18px] border border-[#BFE4F2] bg-[linear-gradient(180deg,#F7FBFD_0%,#EEF6F9_100%)] px-4 py-4 shadow-[0_12px_32px_rgba(8,55,72,0.05)] sm:px-5">
          <h2 className="shrink-0 px-1 text-[18px] font-semibold text-[#20262D]">
            Featured Spoils
          </h2>

          <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
            {featuredSpoils?.map((spoil) => (
              <FeaturedSpoilItem key={spoil.id} spoil={spoil} />
            ))}

            {featuredSpoils.length === 0 && (
              <div className="rounded-[24px] bg-white px-5 py-8 text-center text-[14px] text-[#6D7A86] shadow-[0_18px_40px_rgba(8,55,72,0.08)] ring-1 ring-[#E8F1F5]">
                Featured spoils will appear here once they are available.
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default FeaturedHeroSection;
