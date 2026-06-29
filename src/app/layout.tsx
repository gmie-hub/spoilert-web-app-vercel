import React from "react";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { getSiteUrl } from "@spt/utils/siteUrl";

import QueryProvider from "./providers/QueryProvider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
});

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  // Base URL used to turn relative Open Graph/Twitter URLs into absolute ones.
  // Required for link previews (WhatsApp, Twitter, Facebook) to work in prod.
  metadataBase: new URL(getSiteUrl()),
  title: {
    template: "%s | Spoilert",
    default: "Spoilert",
  },
  description:
    "Spoilert — discover, learn and share knowledge through spoils.",
  openGraph: {
    siteName: "Spoilert",
    type: "website",
    locale: "en_US",
  },
};

// eslint-disable-next-line react-refresh/only-export-components
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <QueryProvider>
          <body className={inter.className}>
            {children}

            <Toaster
              position="top-right"
              toastOptions={{
                style: { fontSize: "1rem" },
              }}
            />
          </body>
        </QueryProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
