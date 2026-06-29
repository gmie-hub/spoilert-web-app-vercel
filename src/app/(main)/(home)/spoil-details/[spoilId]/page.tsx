import SpoilDetails from "@spt/screens/main/home/spoilDetails/spoilDetails";

import type { Metadata } from "next";

interface SpoilDetailsByIdPageProps {
  params: Promise<{
    spoilId: string;
  }>;
}

interface ShareableSpoil {
  title?: string;
  description?: string;
  cover_image_url?: string;
}

const getSpoil = async (spoilId: string): Promise<ShareableSpoil | null> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl.replace(/\/$/, "")}/spoils/${encodeURIComponent(spoilId)}`,
      { next: { revalidate: 300 } },
    );

    if (!response.ok) return null;

    const payload = await response.json();

    return payload?.data ?? null;
  } catch {
    return null;
  }
};

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
}: SpoilDetailsByIdPageProps): Promise<Metadata> {
  const { spoilId } = await params;
  const spoil = await getSpoil(spoilId);

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

  return {
    title,
    description,
    alternates: {
      canonical: `/spoil-details/${spoilId}`,
    },
    openGraph: {
      title,
      description,
      url: `/spoil-details/${spoilId}`,
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

export default async function SpoilDetailsByIdPage({
  params,
}: SpoilDetailsByIdPageProps) {
  const { spoilId } = await params;

  return <SpoilDetails spoilId={spoilId} />;
}
