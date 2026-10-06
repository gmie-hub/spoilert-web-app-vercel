/** Lowercase, hyphen-separated form of `value`, safe to use in a URL path. */
export const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

interface SpoilLinkTarget {
  id: number | string;
  slug?: string | null;
  title?: string | null;
}

/**
 * SEO-friendly URL of a spoil's details page, e.g. `/spoil/159/public-policy-analysis`.
 * Uses the API's `slug`, falling back to the title when a record has none. The
 * page redirects any stale or placeholder slug to the real one.
 */
export const getSpoilDetailsHref = ({ id, slug, title }: SpoilLinkTarget) =>
  `/spoil/${id}/${slug || slugify(title ?? "") || "details"}`;
