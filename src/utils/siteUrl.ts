/**
 * Resolves the public base URL of the site for absolute links and Open Graph
 * tags (used by WhatsApp/Twitter/Facebook link previews).
 *
 * Priority:
 *  1. NEXT_PUBLIC_SITE_URL  — set this in Vercel for your custom domain.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — provided automatically by Vercel.
 *  3. https://thespoilert.com — any other production build (e.g. PM2), so
 *     canonical tags and the sitemap never point Google at localhost.
 *  4. http://localhost:4000 — local dev fallback.
 */
export const getSiteUrl = (): string => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  if (process.env.NODE_ENV === "production") return "https://thespoilert.com";

  return "http://localhost:4000";
};
