import {
  type Timestamp,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { getChatDb } from "@spt/utils/firebase";

import type { PresenceInfo } from "./types";

// presence/{userId}, kept the way the mobile OnlinePresenceService keeps it:
// isOnline plus a lastSeen heartbeat every 30 seconds. Readers only trust
// isOnline while the heartbeat is under two minutes old, so a closed tab
// that never got to write "offline" still drops off.

const PRESENCE = "presence";
const HEARTBEAT_MS = 30_000;
export const ONLINE_WINDOW_MS = 2 * 60_000;
// Firestore "in" filters take at most 30 values.
const IN_LIMIT = 30;

const writePresence = (userId: string, isOnline: boolean) =>
  setDoc(
    doc(getChatDb(), PRESENCE, userId),
    { userId, isOnline, lastSeen: serverTimestamp(), updatedAt: serverTimestamp() },
    { merge: true },
  ).catch(() => {
    // Presence is best-effort; a failed heartbeat must never surface to the user.
  });

/** Mark the user online while the tab is visible. Returns a stop function. */
export function startPresence(userId: string) {
  let timer: ReturnType<typeof setInterval> | null = null;

  const goOnline = () => {
    void writePresence(userId, true);
    if (!timer) timer = setInterval(() => void writePresence(userId, true), HEARTBEAT_MS);
  };
  const goOffline = () => {
    if (timer) clearInterval(timer);
    timer = null;
    void writePresence(userId, false);
  };
  const onVisibilityChange = () =>
    document.visibilityState === "visible" ? goOnline() : goOffline();

  if (document.visibilityState === "visible") goOnline();
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", goOffline);

  return () => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("pagehide", goOffline);
    goOffline();
  };
}

/** Live presence for a set of users, keyed by user id. */
export function subscribeToPresence(
  userIds: string[],
  onChange: (presence: Record<string, PresenceInfo>) => void,
) {
  const ids = Array.from(new Set(userIds.filter(Boolean)));
  const merged: Record<string, PresenceInfo> = {};

  const unsubscribes = Array.from({ length: Math.ceil(ids.length / IN_LIMIT) }, (_, index) =>
    onSnapshot(
      query(
        collection(getChatDb(), PRESENCE),
        where("userId", "in", ids.slice(index * IN_LIMIT, (index + 1) * IN_LIMIT)),
      ),
      (snapshot) => {
        snapshot.docs.forEach((snap) => {
          const data = snap.data({ serverTimestamps: "estimate" });
          merged[String(data.userId ?? snap.id)] = {
            isOnline: Boolean(data.isOnline),
            lastSeen: (data.lastSeen as Timestamp | undefined)?.toDate() ?? null,
          };
        });
        onChange({ ...merged });
      },
      () => {
        // Missing presence just reads as offline.
      },
    ),
  );

  return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
}

export const isPresenceOnline = (presence: PresenceInfo | undefined, now = Date.now()) =>
  Boolean(
    presence?.isOnline &&
      presence.lastSeen &&
      now - presence.lastSeen.getTime() < ONLINE_WINDOW_MS,
  );
