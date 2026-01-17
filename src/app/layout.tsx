// app/layout.tsx
"use client";

import { ReactNode } from "react";

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Toast notifications appear here */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontSize: "1rem" },
          }}
        />
      </body>
    </html>
  );
}
