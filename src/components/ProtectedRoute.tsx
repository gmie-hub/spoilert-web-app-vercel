"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@spt/store/authStore";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  React.useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/auth/signin");
    }
  }, [user, hasHydrated, router]);

  if (!hasHydrated) return null; // Wait for hydration
  if (!user) return null; // could return a spinner
  return <>{children}</>;
}
