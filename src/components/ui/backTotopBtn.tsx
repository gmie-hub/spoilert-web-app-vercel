"use client";
import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import Scroll from "@spt/assets/icons/button(1).svg";
import whiteBackTop from "@spt/assets/icons/whiteBackTop.svg";

function isLightBackground(color: string): boolean {
  if (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)") return true;
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return true;
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  // Standard luminance — above 0.7 = light background
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7;
}

function hasDarkBgAtPoint(x: number, y: number): boolean {
  // Temporarily hide the button so elementFromPoint sees what's behind it
  const btn = document.getElementById("back-to-top-btn");
  if (btn) btn.style.visibility = "hidden";
  const el = document.elementFromPoint(x, y);
  if (btn) btn.style.visibility = "";

  if (!el) return false;

  let current: Element | null = el;
  while (current && current !== document.documentElement) {
    const bg = window.getComputedStyle(current as HTMLElement).backgroundColor;
    if (!isLightBackground(bg)) return true;
    current = current.parentElement;
  }
  return false;
}

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const [isWhite, setIsWhite] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const third = document.getElementById("third-section");
    if (!third) return;

    const check = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const thirdTop = third.getBoundingClientRect().top + scrollY;
      const shouldShow = scrollY >= thirdTop - 10;
      setVisible(shouldShow);

      if (shouldShow) {
        // Button sits at right-4, vertically centered
        const btnX = window.innerWidth - 20;
        const btnY = window.innerHeight / 2;
        setIsWhite(hasDarkBgAtPoint(btnX, btnY));
      }
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(check);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    check();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) return null;

  return (
    <button
      id="back-to-top-btn"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 p-1 cursor-pointer"
      style={{ background: "transparent" }}
    >
      <Image
        src={isWhite ? ((whiteBackTop as any).src ?? whiteBackTop) : ((Scroll as any).src ?? Scroll)}
        alt="Scroll Up"
        width={56}
        height={56}
        className="object-contain"
      />
    </button>
  );
}
