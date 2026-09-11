"use client";

import React from "react";

import { usePathname } from "next/navigation";

import Footer from "@spt/layouts/footer/footer";
import InstitutionAuthLayout from "@spt/layouts/institutionAuthLayout";
import Header from "@spt/layouts/website/header";

interface InstitutionRouteChromeProps {
  children: React.ReactNode;
}

const InstitutionRouteChrome = ({ children }: InstitutionRouteChromeProps) => {
  const pathname = usePathname();

  if (
    pathname?.startsWith("/institution/signup") ||
    pathname?.startsWith("/institution/onboarding")
  ) {
    return (
      <>
        <Header />
        {children}
        <Footer />
      </>
    );
  }

  return <InstitutionAuthLayout>{children}</InstitutionAuthLayout>;
};

export default InstitutionRouteChrome;
