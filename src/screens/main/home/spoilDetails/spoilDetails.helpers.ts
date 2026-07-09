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

export const getTutorName = (spoil: SpoilDetailsData) => {
  const firstName = spoil.tutor?.first_name ?? "";
  const lastName = spoil.tutor?.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Unknown tutor";
};

export const getTutorInitials = (spoil: SpoilDetailsData) => {
  const firstInitial = spoil.tutor?.first_name?.[0] ?? "";
  const lastInitial = spoil.tutor?.last_name?.[0] ?? "";

  return `${firstInitial}${lastInitial}`.toUpperCase() || "NA";
};
