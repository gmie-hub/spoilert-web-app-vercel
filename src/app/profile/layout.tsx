import type { ReactNode } from "react";

import ProtectedRoute from "@spt/components/ProtectedRoute";
import Footer from "@spt/layouts/footer/footer";
import Header from "@spt/layouts/website/header";
import ProfileShell from "@spt/screens/main/profile";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />
      <ProtectedRoute>
        <ProfileShell>{children}</ProfileShell>
      </ProtectedRoute>
      <Footer />
    </>
  );
}
