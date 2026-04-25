export function getErrorMessage(
  error: unknown,
  fallback = "An error occurred. Please try again.",
): string {
  if (!error || typeof error !== "object") return fallback;
  const err = error as { response?: { data?: { message?: string } }; message?: string };
  return err?.response?.data?.message ?? err?.message ?? fallback;
}
