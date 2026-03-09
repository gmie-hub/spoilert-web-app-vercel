import React from "react";

import { Inter } from "next/font/google";

import AuthLayout from "@spt/layouts/authLayout";

import "../globals.css";
import QueryProvider from "../providers/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className={inter.className}>
        <AuthLayout>{children}</AuthLayout>
      </div>
    </QueryProvider>
  );
}