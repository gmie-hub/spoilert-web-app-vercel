import { getSiteUrl } from "@spt/utils/siteUrl";
import { getSpoilDetailsHref } from "@spt/utils/spoilRoutes";

import type { MetadataRoute } from "next";

// Rebuild hourly so newly published spoils reach Google without a redeploy.
export const revalidate = 3600;

const STATIC_PATHS = [
  "",
  "/categories",
  "/about-us",
  "/contact-us",
  "/faqs",
  "/community-guidelines",
  "/privacy-policy",
  "/terms-conditions",
];

// Safety cap so a misbehaving API can't keep the sitemap paging forever.
const MAX_PAGES = 50;

interface SitemapSpoil {
  id: number;
  slug?: string | null;
  title?: string | null;
  updated_at?: string | null;
}

/** Every published spoil from the public (unauthenticated) spoils list. */
const getPublishedSpoils = async (): Promise<SitemapSpoil[]> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

  if (!apiBaseUrl) return [];

  const spoils: SitemapSpoil[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const response = await fetch(
        `${apiBaseUrl}/spoils?per_page=100&page=${page}`,
        { next: { revalidate: 3600 } },
      );

      if (!response.ok) break;

      const payload = (await response.json())?.data;

      spoils.push(...(payload?.data ?? []));

      if (!payload?.last_page || page >= payload.last_page) break;
    } catch {
      break;
    }
  }

  return spoils;
};

/** Served at `/sitemap.xml` — lists the SEO-friendly `/spoil/:id/:slug` URLs for Google. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const spoils = await getPublishedSpoils();

  return [
    ...STATIC_PATHS.map((path) => ({ url: `${siteUrl}${path}` })),
    ...spoils.map((spoil) => ({
      url: `${siteUrl}${getSpoilDetailsHref(spoil)}`,
      lastModified: spoil.updated_at ?? undefined,
    })),
  ];
}
