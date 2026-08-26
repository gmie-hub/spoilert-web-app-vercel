"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import NotificationIcon from "@spt/assets/icons/notification.svg";
import useGetNotificationsQuery, {
  type UserNotification,
} from "@spt/hooks/apiRequests/useGetNotificationsQuery";
import useReadNotificationsMutation from "@spt/hooks/apiRequests/useReadNotificationsMutation";
import useClickOutside from "@spt/hooks/useClickOutside";
import { resolveNotificationRoute } from "@spt/utils/notificationRoute";

// Relative time, e.g. "5m ago" / "2d ago", falling back to a date for old items.
const timeAgo = (iso: string) => {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Clamp a message to `max` characters, flagging whether it was cut so the row
// can show a "Read more" link.
const truncateChars = (text: string, max: number) => {
  if (!text) return { text: "", truncated: false };
  if (text.length <= max) return { text, truncated: false };
  return { text: `${text.slice(0, max).trimEnd()}…`, truncated: true };
};

// Bell trigger + dropdown. Shows a red dot when there are unread notifications,
// lists the top 15, reveals each message on hover, and offers "View all" in the
// footer. `className` is merged onto the wrapper so the header can nudge it.
const NotificationBell = ({ className = "" }: { className?: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useClickOutside(wrapperRef, () => setOpen(false));

  // The bell is not the last thing in the header — the avatar and the mobile
  // menu button sit to its right. That means an `absolute right-0` panel is
  // anchored ~100px in from the screen edge, so on a phone a 360px card hangs
  // off the left of the viewport. Below `sm` we pin the panel to the viewport
  // instead, measuring the bell so it lands just under it whatever height the
  // header currently is.
  const [panel, setPanel] = useState({ compact: false, top: 0 });

  const measure = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    setPanel({
      compact: window.innerWidth < 640,
      top: rect ? rect.bottom + 8 : 0,
    });
  }, []);

  // Measured before opening (not in an effect) so the panel never paints in the
  // wrong place first; kept in sync afterwards for rotation and resizes.
  const toggleOpen = () => {
    if (!open) measure();
    setOpen(!open);
  };

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, measure]);

  const { data: notifications, isLoading, refetch } = useGetNotificationsQuery({
    page: 1,
    per_page: 15,
  });
  const { readNotificationsHandler } = useReadNotificationsMutation();

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications],
  );

  // Refresh the list each time the dropdown is opened so it's instantly fresh.
  useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

  // Poll on an interval so the badge keeps updating without the user opening the
  // dropdown. Skip while the tab is hidden to avoid wasted requests.
  useEffect(() => {
    const id = setInterval(() => {
      if (document.hidden) return;
      refetch();
    }, 30000);
    return () => clearInterval(id);
  }, [refetch]);

  const handleOpenNotification = (n: UserNotification) => {
    if (!n.is_read) readNotificationsHandler([n.id]).catch(() => {});
    setOpen(false);
    // Nothing resolvable to open — fall back to the full notifications list.
    router.push(resolveNotificationRoute(n) ?? "/notifications");
  };

  const handleViewMore = (n: UserNotification) => {
    setOpen(false);
    if (!n.is_read) readNotificationsHandler([n.id]).catch(() => {});
    router.push("/notifications");
  };

  const handleViewAll = () => {
    setOpen(false);
    router.push("/notifications");
  };

  const dropdownList = notifications.slice(0, 15);

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={toggleOpen}
        className="bg-gray-faint relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full md:h-10 md:w-10"
      >
        <Image
          src={NotificationIcon}
          alt="notification"
          width={14.5}
          height={14.5}
          className="md:h-[24px] md:w-[24px]"
        />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 md:right-2 md:top-2" />
        )}
      </button>

      {open && (
        <div
          className={`z-50 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl ${
            panel.compact
              ? "fixed left-3 right-3"
              : "absolute right-0 top-12 w-[360px] max-w-[92vw]"
          }`}
          style={panel.compact ? { top: panel.top } : undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#1E1E1E]">
              Notifications
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </p>
          </div>

          {/* List */}
          <div className="max-h-[min(380px,55vh)] overflow-y-auto overscroll-contain">
            {isLoading && dropdownList.length === 0 ? (
              <div className="px-4 py-10 text-center text-xs text-gray-400">
                Loading…
              </div>
            ) : dropdownList.length === 0 ? (
              <div className="px-4 py-10 text-center text-xs text-gray-400">
                No notifications yet
              </div>
            ) : (
              dropdownList.map((n) => {
                const read = !!n.is_read;
                const { text: preview, truncated } = truncateChars(n.body, 50);
                return (
                  <div
                    key={n.id}
                    onClick={() => handleOpenNotification(n)}
                    className="group flex cursor-pointer gap-3 px-4 py-3 hover:bg-gray-50"
                  >
                    <div className="bg-gray-faint flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                      <Image
                        src={NotificationIcon}
                        alt=""
                        width={16}
                        height={16}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm ${read ? "text-gray-600" : "font-semibold text-[#1E1E1E]"}`}
                      >
                        {n.title}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {timeAgo(n.created_at)}
                      </p>
                      {/* Touch screens have no hover, so the message shows
                          outright on mobile and is hover-revealed from sm up. */}
                      {n.body && (
                        <p className="mt-1 block text-xs leading-relaxed text-gray-500 sm:hidden sm:group-hover:block">
                          {preview}
                          {truncated && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewMore(n);
                              }}
                              className="ml-1 cursor-pointer font-medium text-[#013B4D] hover:underline"
                            >
                              Read more
                            </button>
                          )}
                        </p>
                      )}
                    </div>
                    {!read && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end border-t border-gray-100 px-4 py-3">
            <button
              type="button"
              disabled={dropdownList.length === 0}
              onClick={handleViewAll}
              className="cursor-pointer text-xs font-semibold text-[#013B4D] hover:underline disabled:cursor-not-allowed disabled:opacity-40"
            >
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
