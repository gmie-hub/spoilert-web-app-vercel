// Lesson content is authored with the rich-text editor, so it normally holds an
// HTML string. Older lessons (and simple API payloads) store plain text, which
// has to keep its line breaks when rendered.

/**
 * Strips markup so callers can tell whether the content has any visible text:
 * turn block boundaries into spaces, drop the tags, decode entities, and
 * collapse spacing.
 */
export const htmlToPlainText = (value?: string | null): string => {
  if (!value) return "";

  const spaced = value.replace(/<\/(p|div|li|h[1-6])>|<br\s*\/?>/gi, " ");

  const text =
    typeof window !== "undefined" && typeof DOMParser !== "undefined"
      ? (new DOMParser().parseFromString(spaced, "text/html").body
          .textContent ?? "")
      : spaced.replace(/<[^>]*>/g, "");

  return text.replace(/\s+/g, " ").trim();
};

/** True when the value carries markup and should be rendered as HTML. */
export const containsHtml = (value?: string | null): boolean =>
  /<[a-z][^>]*>/i.test(value ?? "");
