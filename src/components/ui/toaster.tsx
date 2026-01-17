"use client";
import React from "react";

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: "text-[1.4rem]",
          }}
        />
        {children}
      </body>
    </html>
  );
}
