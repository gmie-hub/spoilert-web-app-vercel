"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@spt/store/authStore";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  React.useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
    }
  }, [user, router]);

  if (!user) return null; // could return a spinner
  return <>{children}</>;
}
