import { SpoilDetailsData } from "@spt/utils/spoils";

export const formatExpiryDate = (value?: string | null) => {
  if (!value) return "No expiry date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `Expires on ${date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
};

export const formatPrice = (spoil: SpoilDetailsData) => {
  const amount = spoil.display_amount ?? spoil.amount;

  if (spoil?.pricing?.toLowerCase() === "free") {
    return "Free";
  }

  if (typeof amount === "number") {
    return `₦${amount?.toLocaleString()}`;
  }

  return spoil?.pricing || "Pricing unavailable";
};

/** The tutor's display name when they have one, else their first and last name. */
export const getTutorName = (spoil: SpoilDetailsData) => {
  const displayName = spoil.tutor?.display_name?.trim();
  if (displayName) return displayName;

  const firstName = spoil.tutor?.first_name ?? "";
  const lastName = spoil.tutor?.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Unknown tutor";
};

/** Initials of the name `getTutorName` shows (a display name's first two words). */
export const getTutorInitials = (spoil: SpoilDetailsData) => {
  const displayName = spoil.tutor?.display_name?.trim();
  const [first, last] = displayName
    ? displayName.split(/\s+/)
    : [spoil.tutor?.first_name, spoil.tutor?.last_name];

  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "NA";
};
