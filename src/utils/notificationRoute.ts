import type { UserNotification } from "@spt/hooks/apiRequests/useGetNotificationsQuery";

/**
 * Notifications arrive with a `route` that comes from one of two places:
 *
 *  1. An admin composing a broadcast, who picks from a fixed list of screens.
 *     Those land here as slugs, e.g. `"my_learning"`, `"wallet"`, `"home_page"`.
 *  2. The backend raising a system notification, which sends an API-shaped path,
 *     e.g. `"/spoils/124"` — note it is the *API* resource name, not this app's
 *     URL (`/spoils/124` does not exist here; the page is `/spoil-details/124`).
 *
 * Neither form can be handed to `router.push` as-is, so everything goes through
 * `resolveNotificationRoute` first.
 */

/** Screen each admin-selectable route slug maps to in this app. */
export const notificationSlugRoutes: Record<string, string> = {
  home_page: "/",
  all_spoylz: "/categories",
  categories_page: "/categories",
  // Search lives in the site header rather than on its own page.
  search: "/",
  my_learning: "/my-learnings",
  saved_spoylz: "/profile/my-bookmarks",
  my_certificates: "/my-learnings",
  // No leaderboard screen on web yet — send them somewhere useful instead.
  leaderboard: "/",
  register_as_tutor: "/create-spoils/start-kyc",
  tutor_dashboard: "/profile/my-spoils",
  create_spoil: "/create-spoils",
  my_created_spoylz: "/profile/my-spoils",
  my_learners: "/profile/my-spoils",
  tutor_verification: "/create-spoils/kyc-process",
  tutor_analytics: "/profile/spoil-performance-analytics",
  reviews: "/profile/spoil-stats",
  wallet: "/profile/earnings-breakdown",
  transactions: "/profile/transaction-history",
  withdrawal: "/profile/manage-bank-account",
  promote_a_spoil: "/profile/my-promotions",
  my_promotions: "/profile/my-promotions",
  sponsorships: "/profile/my-sponsorships",
  sponsor_a_spoil: "/profile/my-sponsorships",
  redeem_sponsorship_code: "/profile/my-sponsorships",
  community: "/community",
  chat: "/messages",
  notifications: "/notifications",
  my_profile: "/profile/profile-details",
  settings: "/profile/change-password",
  help: "/profile/customer-support",
};

/**
 * Backend path prefixes that differ from this app's URLs. `rest` is whatever
 * followed the first segment, so `/spoils/124` calls `spoils(["124"])`.
 */
const resourceRoutes: Record<string, (rest: string[]) => string> = {
  spoils: ([id]) => (id ? `/spoil-details/${id}` : "/categories"),
  spoil: ([id]) => (id ? `/spoil-details/${id}` : "/categories"),
  courses: ([id]) => (id ? `/spoil-details/${id}` : "/categories"),
  chats: ([id]) => (id ? `/messages/${id}` : "/messages"),
  conversations: ([id]) => (id ? `/messages/${id}` : "/messages"),
  certificates: () => "/my-learnings",
  enrollments: () => "/my-learnings",
  bookmarks: () => "/profile/my-bookmarks",
  wallet: () => "/profile/earnings-breakdown",
  transactions: () => "/profile/transaction-history",
  withdrawals: () => "/profile/manage-bank-account",
  promotions: () => "/profile/my-promotions",
  sponsorships: () => "/profile/my-sponsorships",
  users: () => "/profile/profile-details",
};

/** `"MY_LEARNING"`, `"my-learning"` and `"/my learning"` all become `my_learning`. */
const toSlug = (value: string) =>
  value
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

/** Drop the origin so a fully-qualified URL is treated like a path. */
const toPath = (value: string) => {
  if (!/^https?:\/\//i.test(value)) return value;
  try {
    const { pathname, search } = new URL(value);
    return `${pathname}${search}`;
  } catch {
    return value;
  }
};

/**
 * Turn a notification into a path this app can navigate to, or `null` when
 * there is nothing meaningful to open (callers hide their link in that case).
 */
export const resolveNotificationRoute = (
  notification: Pick<UserNotification, "route" | "section" | "meta">,
): string | null => {
  const raw = notification.route?.trim();

  if (raw) {
    const path = toPath(raw);

    // Admin-picked slug, with or without a leading slash.
    const slugMatch = notificationSlugRoutes[toSlug(path)];
    if (slugMatch) return slugMatch;

    if (path.startsWith("/")) {
      const [first, ...rest] = path.replace(/^\/+/, "").split("/");
      const resource = resourceRoutes[first?.toLowerCase() ?? ""];
      if (resource) return resource(rest);

      // Unknown path — pass it through so routes added on the backend later
      // still work without a release here.
      return path;
    }
  }

  // No usable route: fall back to whatever the payload identifies.
  const spoilId = notification.meta?.spoil_id;
  if (typeof spoilId === "number" || typeof spoilId === "string") {
    return `/spoil-details/${spoilId}`;
  }

  const sectionMatch = notification.section
    ? notificationSlugRoutes[toSlug(notification.section)]
    : undefined;

  return sectionMatch ?? null;
};

export default resolveNotificationRoute;
