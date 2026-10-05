export const PAGE_SIZE = 10;

export const pageCount = (itemCount: number) => Math.max(1, Math.ceil(itemCount / PAGE_SIZE));

export const pageItems = <T>(items: T[], page: number) =>
  items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

const toDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// 22-07-2026
export const formatDate = (value?: string | null) =>
  toDate(value)?.toLocaleDateString("en-GB").split("/").join("-") ?? "-";

// 09:43am
export const formatTime = (value?: string | null) =>
  toDate(value)
    ?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    .replace(/\s/g, "")
    .toLowerCase() ?? "-";

// ₦1,500,000 or ₦152,500.50 — null when there's no amount, so callers pick
// "-" or "No data".
export const formatNaira = (value?: number | string | null) => {
  if (value == null || value === "") return null;
  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;
  const kobo = Number.isInteger(amount) ? 0 : 2;
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: kobo, maximumFractionDigits: 2 })}`;
};

// "sponsored_spoil" -> "Sponsored Spoil"
export const humanize = (value: string) =>
  value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
