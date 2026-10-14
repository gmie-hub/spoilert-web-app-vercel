import { getSiteUrl } from "@spt/utils/siteUrl";

import type { MetadataRoute } from "next";

/**
 * Served at `/robots.txt`. Old `/spoil-details/:id` links stay crawlable on
 * purpose, so Google follows their redirect to the `/spoil/:id/:slug` URL.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/profile",
        "/payment",
        "/notifications",
        "/onboarding",
        "/messages",
        "/create-spoils",
        "/my-learnings",
      ],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
