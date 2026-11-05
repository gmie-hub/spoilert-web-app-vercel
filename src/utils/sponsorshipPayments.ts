// localStorage key holding the payment references of sponsorships started in
// this browser. The gateway opens in a new tab and redirects back to
// `/payment/verification`, which reads this to tell a sponsorship apart from a
// regular spoil purchase (sessionStorage doesn't carry over to the new tab).
export const SPONSORSHIP_PAYMENTS_KEY = "sponsorship-payment-refs";

// Only the most recent references are kept so the list can't grow unbounded.
const MAX_REFS = 20;

const readRefs = (): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SPONSORSHIP_PAYMENTS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Remember that `reference` belongs to a sponsorship payment. */
export const rememberSponsorshipPayment = (reference?: string | null) => {
  if (!reference) return;
  try {
    const refs = [reference, ...readRefs().filter((ref) => ref !== reference)];
    localStorage.setItem(
      SPONSORSHIP_PAYMENTS_KEY,
      JSON.stringify(refs.slice(0, MAX_REFS)),
    );
  } catch {
    // ignore if localStorage is unavailable
  }
};

/** Whether `reference` was started from the Sponsor Spoil flow. */
export const isSponsorshipPayment = (reference?: string | null) =>
  Boolean(reference) && readRefs().includes(reference as string);
