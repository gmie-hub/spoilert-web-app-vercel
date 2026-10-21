"use client";

import { useCallback, useEffect, useState } from "react";

import { isPresenceOnline, subscribeToPresence } from "@spt/utils/chat/presence";
import type { PresenceInfo } from "@spt/utils/chat/types";
import { isFirebaseConfigured } from "@spt/utils/firebaseConfig";

const RECHECK_MS = 30_000;

/**
 * Who of `userIds` is online. Returns a lookup rather than a map so callers
 * don't care that presence is re-evaluated as heartbeats age out.
 */
export default function usePresence(userIds: (string | number)[]) {
  const key = Array.from(new Set(userIds.map(String).filter(Boolean))).sort().join(",");
  const [presence, setPresence] = useState<Record<string, PresenceInfo>>({});
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!key || !isFirebaseConfigured) return;
    return subscribeToPresence(key.split(","), setPresence);
  }, [key]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), RECHECK_MS);
    return () => clearInterval(timer);
  }, []);

  return useCallback(
    (userId?: string | number | null) => {
      const info = userId == null ? undefined : presence[String(userId)];
      return { online: isPresenceOnline(info, now), lastSeen: info?.lastSeen ?? null };
    },
    [presence, now],
  );
}
