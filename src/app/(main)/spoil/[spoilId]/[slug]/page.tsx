import { permanentRedirect } from "next/navigation";

import SpoilDetails from "@spt/screens/main/home/spoilDetails/spoilDetails";
import { getPublicSpoil } from "@spt/utils/getPublicSpoil";
import { getSpoilDetailsHref } from "@spt/utils/spoilRoutes";

import type { Metadata } from "next";

interface SpoilDetailsPageProps {
  params: Promise<{
    spoilId: string;
    slug: string;
  }>;
}

const getAbsoluteImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return null;

  try {
    return new URL(
      imageUrl,
      process.env.NEXT_PUBLIC_API_BASE_URL,
    ).toString();
  } catch {
    return null;
  }
};

const getPlainText = (value?: string) =>
  value
    ?.replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);

// Next.js requires metadata generators to be exported from route files.
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({
  params,
}: SpoilDetailsPageProps): Promise<Metadata> {
  const { spoilId, slug } = await params;
  const spoil = await getPublicSpoil(spoilId);

  if (!spoil) {
    return {
      title: "Spoylz Details",
      description: "Discover this learning experience on Spoilert.",
    };
  }

  const title = spoil.title?.trim() || "Spoylz Details";
  const description =
    getPlainText(spoil.description) ||
    `Discover ${title}, a learning experience on Spoilert.`;
  const imageUrl = getAbsoluteImageUrl(spoil.cover_image_url);
  const images = imageUrl
    ? [{ url: imageUrl, width: 1200, height: 630, alt: title }]
    : undefined;
  const canonicalUrl = getSpoilDetailsHref({ ...spoil, id: spoilId, slug: spoil.slug || slug });

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Spoilert",
      type: "article",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function SpoilDetailsPage({
  params,
}: SpoilDetailsPageProps) {
  const { spoilId, slug } = await params;
  const spoil = await getPublicSpoil(spoilId);

  // One URL per spoil: send stale (renamed) or placeholder slugs to the real one.
  if (spoil?.slug && spoil.slug !== slug) {
    permanentRedirect(getSpoilDetailsHref({ ...spoil, id: spoilId }));
  }

  return <SpoilDetails spoilId={spoilId} />;
}
