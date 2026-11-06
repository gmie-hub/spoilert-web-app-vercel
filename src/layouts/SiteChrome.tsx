"use client";

import { type ReactNode, useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import ChatPresence from "@spt/layouts/ChatPresence";
import Footer from "@spt/layouts/footer/footer";
import Header from "@spt/layouts/website/header";
import { useAuthStore } from "@spt/store/authStore";
import { CHAT_ENABLED } from "@spt/utils/chat/enabled";
import {
  INSTITUTION_HOME,
  isInstitutionRole,
  isLearnerOnlyPath,
} from "@spt/utils/institutionAccess";

// The certificate deep link (/my-learnings/certificate/...) is a mobile → web
// hand-off that should render as a standalone page — no site header/footer.
// Both the token entry route and the certificate view it redirects to are
// covered. Every other route keeps the normal chrome.
const isBareRoute = (pathname: string | null) =>
  !!pathname && /^\/my-learnings\/certificate(\/|$)/.test(pathname);

// The chat screen fills the window below the header, like a messaging app; a
// footer underneath would let the page scroll and slide the chat out of view.
const isFullScreenRoute = (pathname: string | null) =>
  !!pathname && /^\/messages\/[^/]+\/?$/.test(pathname);

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = useAuthStore((state) => state.user?.role);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  // Institutions can't use the learner/creator pages (My Learnings, Create
  // Spoylz, Community) — send them to their dashboard. The stored login only
  // exists in the browser, so these pages stay blank until it has loaded
  // rather than flashing before the redirect.
  const learnerOnly = !isBareRoute(pathname) && isLearnerOnlyPath(pathname);
  const isInstitution = isInstitutionRole(role);
  const blockInstitution = learnerOnly && hasHydrated && isInstitution;

  useEffect(() => {
    if (blockInstitution) router.replace(INSTITUTION_HOME);
  }, [blockInstitution, router]);

  if (isBareRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      {CHAT_ENABLED && <ChatPresence />}
      <Header />
      {learnerOnly && (!hasHydrated || isInstitution) ? null : children}
      {!isFullScreenRoute(pathname) && <Footer />}
    </>
  );
}
