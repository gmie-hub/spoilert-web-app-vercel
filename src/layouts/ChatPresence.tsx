"use client";

import { useEffect } from "react";

import { useAuthStore } from "@spt/store/authStore";
import { isFirebaseConfigured } from "@spt/utils/firebaseConfig";

// Shows the signed-in user as "Online" in chat (web and mobile) while any
// page of the site is open, like the mobile app does while it's in use.
// Firebase loads after the page, so it never slows down the first paint.
export default function ChatPresence() {
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (!userId || !isFirebaseConfigured) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    import("@spt/utils/chat/presence")
      .then(({ startPresence }) => {
        if (!cancelled) stop = startPresence(String(userId));
      })
      .catch(() => {
        // Presence is best-effort.
      });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [userId]);

  return null;
}
