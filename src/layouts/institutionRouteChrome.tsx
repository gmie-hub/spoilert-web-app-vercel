"use client";

import React from "react";

import { usePathname } from "next/navigation";

import Footer from "@spt/layouts/footer/footer";
import InstitutionAuthLayout from "@spt/layouts/institutionAuthLayout";
import InstitutionDashboardLayout from "@spt/layouts/institutionDashboardLayout";
import Header from "@spt/layouts/website/header";

const DASHBOARD_PREFIXES = [
  "/institution/dashboard",
  "/institution/lecturers",
  "/institution/spoylz-management",
  "/institution/revenue",
];

interface InstitutionRouteChromeProps {
  children: React.ReactNode;
}

const InstitutionRouteChrome = ({ children }: InstitutionRouteChromeProps) => {
  const pathname = usePathname();

  if (DASHBOARD_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) {
    return <InstitutionDashboardLayout>{children}</InstitutionDashboardLayout>;
  }

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
