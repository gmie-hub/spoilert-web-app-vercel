// Display formatting for chat timestamps, sizes and presence.

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const daysAgo = (date: Date, now: Date) =>
  Math.round((startOfDay(now) - startOfDay(date)) / DAY_MS);

export const formatClockTime = (date: Date) =>
  date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

export const isSameDay = (a: Date, b: Date) => startOfDay(a) === startOfDay(b);

/** Divider above each day's messages: Today, Yesterday, Monday, 3 Oct 2026. */
export const formatDayLabel = (date: Date, now = new Date()) => {
  const days = daysAgo(date, now);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return date.toLocaleDateString("en-US", { weekday: "long" });
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

/** Time beside a conversation in a list: 9:41 AM, Yesterday, Mon, 03/10/2026. */
export const formatListTime = (date: Date, now = new Date()) => {
  const days = daysAgo(date, now);
  if (days <= 0) return formatClockTime(date);
  if (days === 1) return "Yesterday";
  if (days < 7) return date.toLocaleDateString("en-US", { weekday: "short" });
  return date.toLocaleDateString("en-GB");
};

export const formatFileSize = (bytes?: number | null) => {
  if (bytes == null) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
};

export const formatLastSeen = (lastSeen: Date | null, now = new Date()) => {
  if (!lastSeen) return "Offline";
  const minutes = Math.floor((now.getTime() - lastSeen.getTime()) / 60_000);
  if (minutes < 1) return "Last seen just now";
  if (minutes < 60) return `Last seen ${minutes}m ago`;
  const days = daysAgo(lastSeen, now);
  if (days <= 0) return `Last seen today at ${formatClockTime(lastSeen)}`;
  if (days === 1) return `Last seen yesterday at ${formatClockTime(lastSeen)}`;
  return `Last seen ${lastSeen.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

// Muted tones from the chat design, picked per user so a person keeps the same
// colour everywhere.
const AVATAR_COLORS = [
  "#A8BAC6",
  "#7A9BB2",
  "#95A5AE",
  "#7B8F9A",
  "#C9864A",
  "#A0B5C0",
  "#8499A5",
  "#9CADB8",
];

export const getAvatarColor = (userId: string) => {
  const hash = Array.from(userId).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};
