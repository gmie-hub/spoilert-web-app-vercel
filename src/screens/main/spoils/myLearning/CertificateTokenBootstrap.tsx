"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { AUTH_STORAGE_KEY, useAuthStore } from "@spt/store/authStore";
import api from "@spt/utils/apiClient";

interface CertificateTokenBootstrapProps {
  userId: string;
  spoilId: string;
  token: string;
}

// Merge the token into the persisted auth entry in localStorage, synchronously,
// in the exact shape the axios interceptor reads (`{ state: { token }, ... }`).
// This guarantees the token is in place before the certificate page fires its
// first request, without waiting on zustand's async persist.
const writeTokenToStorage = (token: string) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const existing = JSON.parse(
      window.localStorage.getItem(AUTH_STORAGE_KEY) || "{}",
    );
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        ...existing,
        version: existing.version ?? 0,
        state: { ...(existing.state ?? {}), token },
      }),
    );
  } catch {
    // localStorage unavailable / unparseable — setState below still updates the
    // in-memory store as a fallback.
  }
};

// Entry point for the mobile deep link
// /my-learnings/certificate?userId={userId}&spoilId={spoilId}&token={token}.
// The mobile app is already logged in and hands us its auth token; we replay a
// "login" here — store the token so every API call is authenticated, load the
// learner's profile (by userId) so their name prints on the certificate, then
// redirect to the certificate page without the token. We router.replace() so the
// token never lingers in the browser history.
export default function CertificateTokenBootstrap({
  userId,
  spoilId,
  token,
}: CertificateTokenBootstrapProps) {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);
  // Guards against React strict-mode running the effect twice in dev.
  const startedRef = useRef(false);

  const certificateUrl = `/my-learnings/certificate?userId=${encodeURIComponent(
    userId,
  )}&spoilId=${encodeURIComponent(spoilId)}`;

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    if (!token) {
      setHasError(true);
      return;
    }

    // The token travels in the URL query, where its "|" separator is
    // percent-encoded as %7C. Next.js normally decodes query params, but decode
    // defensively so the token is never stored/sent as "1115%7C..." (a literal
    // %7C), which the backend rejects → 401. Sanctum tokens ({id}|{plaintext})
    // contain no "%", so decoding an already-decoded token is a safe no-op.
    let normalizedToken = token;
    try {
      normalizedToken = decodeURIComponent(token);
    } catch {
      // Malformed percent-encoding — keep the raw token as-is.
    }

    let cancelled = false;

    const bootstrap = async () => {
      // 0. Wait until the persisted auth store has finished reading localStorage.
      // The mobile deep link opens a brand-new tab, so the store rehydrates
      // asynchronously. If we wrote the token before rehydration finished, the
      // late-arriving rehydration would overwrite it back to null and every API
      // call on the certificate page would go out unauthenticated (401).
      if (!useAuthStore.persist.hasHydrated()) {
        await new Promise<void>((resolve) => {
          const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
            unsubscribe();
            resolve();
          });
        });
      }

      if (cancelled) {
        return;
      }

      // 1. Persist the token so the axios interceptor (which reads it from
      // localStorage) authenticates every request the certificate page makes.
      // We write localStorage directly, synchronously, in the exact shape the
      // interceptor reads — instead of relying only on the store's async
      // persist/rehydrate, which was letting the certificate page's first
      // requests go out before the token landed (→ 401). setState keeps the
      // in-memory store in sync for any component that reads it.
      writeTokenToStorage(normalizedToken);
      useAuthStore.setState({ token: normalizedToken });

      // 2. Load the learner's profile from /users/{userId} (the id comes from
      // the deep link) so setAuth stores a real user — first_name / last_name
      // are what render on the certificate.
      if (userId) {
        try {
          const response = await api.get(`/users/${userId}`);
          const user = response?.data?.data;
          if (user) {
            useAuthStore.getState().setAuth({ user, token: normalizedToken });
          }
        } catch {
          // Profile fetch failed — keep the stored token and continue. The
          // certificate still renders and downloads; only the printed name is
          // missing, which is better than dead-ending the learner.
        }
      }

      if (!cancelled) {
        router.replace(certificateUrl);
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [userId, token, certificateUrl, router]);

  if (hasError) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6 text-center">
        <div className="max-w-sm">
          <h1 className="text-lg font-semibold text-[#212529]">
            This certificate link is invalid
          </h1>
          <p className="mt-2 text-sm text-[#5F6B76]">
            The link is missing its access token. Please reopen your certificate
            from the app.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <span
          aria-hidden
          className="h-10 w-10 animate-spin rounded-full border-2 border-[#0C4A5C] border-t-transparent"
        />
        <p className="text-sm font-medium text-[#5F6B76]">
          Preparing your certificate…
        </p>
      </div>
    </section>
  );
}
