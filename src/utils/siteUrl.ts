/**
 * Resolves the public base URL of the site for absolute links and Open Graph
 * tags (used by WhatsApp/Twitter/Facebook link previews).
 *
 * Priority:
 *  1. NEXT_PUBLIC_SITE_URL  — set this in Vercel for your custom domain.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — provided automatically by Vercel.
 *  3. http://localhost:3000 — local dev fallback.
 */
export const getSiteUrl = (): string => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
};
