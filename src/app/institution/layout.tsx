import React from "react";

import { Metadata } from "next";
import { Inter } from "next/font/google";

import InstitutionRouteChrome from "@spt/layouts/institutionRouteChrome";

import "../globals.css";
import QueryProvider from "../providers/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
});

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "Institution Portal",
  description:
    "Create or log in to your Spoylz institution account to manage learners, courses, earnings and performance.",
};

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className={inter.className}>
        <InstitutionRouteChrome>{children}</InstitutionRouteChrome>
      </div>
    </QueryProvider>
  );
}
