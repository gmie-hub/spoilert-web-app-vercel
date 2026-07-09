// Decodes the auth token the mobile app hands us in the certificate deep link.
// The token is the same one the web login uses; it's a JWT, so we can read its
// payload (without verifying the signature — the backend still verifies it on
// every API call) to pull out the learner's user id and then fetch their
// profile. We never trust these values for auth, only to know which /users/{id}
// to load.

// base64url -> UTF-8 string. JWT segments are base64url (no padding, `-`/`_`
// instead of `+`/`/`), and the JSON payload can contain unicode, so decode the
// bytes through TextDecoder rather than a raw atob() string.
function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (base64.length % 4)) % 4;
  const padded = base64 + "=".repeat(padding);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decodeJwtPayload(
  token: string,
): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    // A JWT is header.payload.signature — we only need the payload (index 1).
    if (parts.length < 2 || !parts[1]) {
      return null;
    }
    return JSON.parse(base64UrlDecode(parts[1])) as Record<string, unknown>;
  } catch {
    // Malformed / non-JWT token — caller falls back to storing the raw token.
    return null;
  }
}

// Pull the user id out of the decoded payload. Different Laravel auth setups
// expose it under different claims (Passport/tymon use `sub`, others nest it),
// so check the common shapes and take the first positive integer we find.
export function getUserIdFromToken(token: string): number | null {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return null;
  }

  const nested = (key: string) =>
    (payload[key] as { id?: unknown } | undefined)?.id;

  const candidates: unknown[] = [
    payload["sub"],
    payload["user_id"],
    payload["userId"],
    payload["uid"],
    payload["id"],
    nested("user"),
    nested("data"),
  ];

  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined) {
      continue;
    }
    const id = Number(candidate);
    if (Number.isFinite(id) && id > 0) {
      return id;
    }
  }

  return null;
}
