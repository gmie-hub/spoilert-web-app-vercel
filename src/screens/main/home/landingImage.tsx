
"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import HeroImage3 from "@spt/assets/images/Hero(3).png";
import HeroImage1 from "@spt/assets/images/Hero(4).png";
import HeroImage2 from "@spt/assets/images/Hero(5).png";
import Button from "@spt/components/button";
import { useAuthStore } from "@spt/store/authStore";

const slides = [HeroImage1.src, HeroImage2.src, HeroImage3.src];

export default function HeroSlider() {


  const [index, setIndex] = useState(0);
  const authUser = useAuthStore((state) => state.user);
  const router = useRouter();


  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden h-[60vh] md:h-[75vh] lg:h-[85vh]">
      {/* Slides */}
      {slides.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={img}
            alt="Hero slide"
            fill
            sizes="100vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Gradient overlay (like your design) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-20" />

      {/* Content */}
      <div className="relative z-30 flex h-full items-center justify-center text-center px-4 sm:px-6">
        <div className="max-w-4xl text-white px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-2 md:mb-4 leading-snug">
            Empowering <span className="text-[var(--color-yellow)]">Global Education.</span>
          </h1>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 md:mb-6 leading-snug">
            Learn, Teach, and <span className="text-[var(--color-yellow)]">Earn Money.</span>
          </h2>

          <p className="font-normal text-sm sm:text-base md:text-lg leading-[1.5] tracking-[-0.02em] text-center opacity-90 mb-6 md:mb-8 max-w-2xl mx-auto">
            Discover a world of knowledge and skill acquisition from leading experts and reputable institutions around the world.
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            <Button variant="default" className="rounded-full px-4 py-2 text-sm sm:text-base">
              Download App
            </Button>
            {!authUser && (
              <Button
                variant="whiteOutline"
                className="rounded-full px-4 py-2 text-sm sm:text-base"
                onClick={() => router.push("/auth/signin")}
              >
                Get Started
              </Button>
            )}

          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6 md:mt-10">
            {slides.map((_, i) => (
              <span
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-transform duration-200 ${
                  i === index ? "bg-[#1C87A8] scale-110" : "bg-[#F5F4F4]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
