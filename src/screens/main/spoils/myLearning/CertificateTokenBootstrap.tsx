"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@spt/store/authStore";
import api from "@spt/utils/apiClient";
import { getUserIdFromToken } from "@spt/utils/decodeToken";

interface CertificateTokenBootstrapProps {
  spoilId: string;
  token: string;
}

// Entry point for the mobile deep link
// /my-learnings/certificate/{spoilId}/{token}. The mobile app is already logged
// in and hands us its auth token; we replay a "login" here — store the token so
// every API call is authenticated, load the learner's profile so their name
// prints on the certificate, then redirect to the existing certificate page.
// We router.replace() so the token never lingers in the browser history.
export default function CertificateTokenBootstrap({
  spoilId,
  token,
}: CertificateTokenBootstrapProps) {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);
  // Guards against React strict-mode running the effect twice in dev.
  const startedRef = useRef(false);

  const certificateUrl = `/my-learnings/certificate/${encodeURIComponent(
    spoilId,
  )}`;

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    if (!token) {
      setHasError(true);
      return;
    }

    let cancelled = false;

    const bootstrap = async () => {
      // 1. Persist the token first so the axios interceptor (which reads it from
      // localStorage) authenticates the profile call below and every request the
      // certificate page makes afterwards.
      useAuthStore.setState({ token });

      // 2. The token carries the learner's user id. Decode it and fetch the full
      // profile from /users/{id} so setAuth stores a real user (first_name /
      // last_name are what render on the certificate).
      const userId = getUserIdFromToken(token);

      if (userId) {
        try {
          const response = await api.get(`/users/${userId}`);
          const user = response?.data?.data;
          if (user) {
            useAuthStore.getState().setAuth({ user, token });
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
  }, [token, certificateUrl, router]);

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
