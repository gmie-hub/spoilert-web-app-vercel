import React from "react";

import { Inter } from "next/font/google";

import Footer from "@spt/layouts/footer/footer";
import Header from "@spt/layouts/website/header";

import QueryProvider from "../providers/QueryProvider";

import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryProvider>
        <body className={inter.className}>
          <Header />
          {children}
          <Footer />
        </body>
      </QueryProvider>
    </html>
  );
}
