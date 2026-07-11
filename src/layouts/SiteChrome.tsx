"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";

import Footer from "@spt/layouts/footer/footer";
import Header from "@spt/layouts/website/header";

// The certificate deep link (/my-learnings/certificate/...) is a mobile → web
// hand-off that should render as a standalone page — no site header/footer.
// Both the token entry route and the certificate view it redirects to are
// covered. Every other route keeps the normal chrome.
const isBareRoute = (pathname: string | null) =>
  !!pathname && /^\/my-learnings\/certificate(\/|$)/.test(pathname);

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (isBareRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
