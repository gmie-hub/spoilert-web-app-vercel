export interface PublicSpoil {
  id?: number;
  slug?: string;
  title?: string;
  description?: string;
  cover_image_url?: string;
}

/**
 * Server-side, unauthenticated fetch of a spoil — for metadata and canonical
 * redirects. Returns null when the API is unreachable or the spoil isn't public.
 */
export const getPublicSpoil = async (spoilId: string): Promise<PublicSpoil | null> => {
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
