"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import Scroll from "@spt/assets/icons/button(1).svg";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const third = document.getElementById("third-section");
    if (!third) return;

    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const top = third.getBoundingClientRect().top + scrollY;
      setVisible(scrollY >= top - 10);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 p-1 cursor-pointer"
      style={{ background: "transparent" }}
    >
      <Image
        src={(Scroll as any).src ?? Scroll}
        alt="Scroll Up"
        width={56}
        height={56}
        className="object-contain"
      />
    </button>
  );
}
