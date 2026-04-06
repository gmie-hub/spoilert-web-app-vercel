import { CertificateCustomization } from "@spt/store/createSpoilStore";

export const DESIGN_COLORS = [
  "#1D4EC8",
  "#2F63DA",
  "#DFC062",
  "#D9BB93",
  "#161616",
  "#D1A546",
  "#FFFFFF",
];

export const DEFAULT_COLORS = [
  "#3CCF8E",
  "#3E434C",
  "#71757D",
  "#A9ADB5",
  "#CFCFD2",
  "#FFFFFF",
  "#CE5232",
  "#F29A9A",
  "#B24FD3",
  "#E367E3",
  "#7C5BEC",
  "#9A84F0",
  "#3DD28C",
  "#87DB9B",
  "#1C52CC",
  "#AFC5F8",
  "#398CE6",
  "#88C0EF",
  "#248A93",
  "#DDA733",
  "#F0C762",
  "#F98622",
  "#F8B577",
  "#89AA2B",
];

export const TOOLBAR_TEXT_ACTIONS = ["I", "B", "A", "U", "S"] as const;

export const FONT_OPTIONS = [
  "Arial, Helvetica, sans-serif",
  "Georgia, Times New Roman, serif",
  "Tahoma, Geneva, sans-serif",
  "Trebuchet MS, Arial, sans-serif",
];

export const FALLBACK_FIELDS: CertificateCustomization["fields"] = {
  title: {
    text: "CERTIFICATE\nOF COMPLETION",
    color: "#111827",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 26,
    fontWeight: 700,
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "center",
    lineHeight: 1.15,
  },
  recipientName: {
    text: "Name Surname",
    color: "#222222",
    fontFamily: "Georgia, Times New Roman, serif",
    fontSize: 34,
    fontWeight: 400,
    fontStyle: "italic",
    textDecoration: "none",
    textAlign: "center",
    lineHeight: 1.1,
  },
  body: {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tellus nulla tellus, vitae vitae amet fusce. Non nec aliquet nunc vitae eget mattis.",
    color: "#5F6670",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 10,
    fontWeight: 400,
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "center",
    lineHeight: 1.35,
  },
};

export const getCertificateFields = (
  fields?: Partial<CertificateCustomization["fields"]> | null,
): CertificateCustomization["fields"] => ({
  ...FALLBACK_FIELDS,
  ...(fields ?? {}),
  title: {
    ...FALLBACK_FIELDS.title,
    ...(fields?.title ?? {}),
  },
  recipientName: {
    ...FALLBACK_FIELDS.recipientName,
    ...(fields?.recipientName ?? {}),
  },
  body: {
    ...FALLBACK_FIELDS.body,
    ...(fields?.body ?? {}),
  },
});
