"use client";

import React from "react";

import ProtectedRoute from "@spt/components/ProtectedRoute";

export default function CreateSpoilsLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
