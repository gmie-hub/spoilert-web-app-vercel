"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import SpoilertLogo from "@spt/assets/icons/Group(2).svg";
import useClickOutside from "@spt/hooks/useClickOutside";
import LogoutConfirmModal from "@spt/layouts/website/LogoutConfirmModal";
import { useAuthStore } from "@spt/store/authStore";

interface NavItem {
  label: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

const COLLAPSE_STORAGE_KEY = "spoilert-institution-sidebar-collapsed";

const iconStroke = (active: boolean) => (active ? "var(--color-blue)" : "#9CA3AF");

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/institution/dashboard",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="2" stroke={iconStroke(active)} strokeWidth="1.8" />
        <rect x="13" y="3" width="8" height="8" rx="2" stroke={iconStroke(active)} strokeWidth="1.8" />
        <rect x="3" y="13" width="8" height="8" rx="2" stroke={iconStroke(active)} strokeWidth="1.8" />
        <rect x="13" y="13" width="8" height="8" rx="2" stroke={iconStroke(active)} strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/institution/profile",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" stroke={iconStroke(active)} strokeWidth="1.8" />
        <path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" stroke={iconStroke(active)} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Lecturers",
    href: "/institution/lecturers",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="3" stroke={iconStroke(active)} strokeWidth="1.8" />
        <circle cx="16.5" cy="9" r="2.5" stroke={iconStroke(active)} strokeWidth="1.8" />
        <path d="M2.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke={iconStroke(active)} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14.5 14.5c2.5 0 4.5 1.8 4.5 4.5" stroke={iconStroke(active)} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Spoylz Management",
    href: "/institution/spoylz-management",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z"
          stroke={iconStroke(active)}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13Z"
          stroke={iconStroke(active)}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  /* Temporarily hidden from the sidebar.
  {
    label: "Revenue",
    href: "/institution/revenue",
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 12a9 9 0 1 1 3.5 7.1"
          stroke={iconStroke(active)}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path d="M3 8v4h4" stroke={iconStroke(active)} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8v4l2.5 1.5" stroke={iconStroke(active)} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  */
];

interface InstitutionDashboardLayoutProps {
  children: React.ReactNode;
  institutionName?: string;
}

const InstitutionDashboardLayout = ({
  children,
  institutionName,
}: InstitutionDashboardLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const storedName = useAuthStore((state) => state.user?.name);
  const storedRole = useAuthStore((state) => state.user?.role);
  const isInstitution = String(storedRole ?? "").toLowerCase() === "institution";
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  useEffect(() => {
    if (!isMobileNavOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileNavOpen]);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_STORAGE_KEY) === "1");
    } catch {
      // ignore if localStorage is unavailable
    } finally {
      setMounted(true);
    }
  }, []);

  // Only institution accounts get in: logged-out visitors and other roles (e.g. a
  // learner signed in on the main site) go to the institution login. Checked
  // after mount because the stored login only exists in the browser.
  useEffect(() => {
    if (mounted && !isInstitution) router.replace("/institution/login");
  }, [mounted, isInstitution, router]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore if localStorage is unavailable
      }
      return next;
    });
  };

  // The persisted login only exists in the browser, so wait for mount before using
  // it — otherwise the server and client renders disagree. Follows profile edits.
  const displayName = (mounted && (storedName || institutionName)) || "";

  // Shared by the desktop sidebar and the mobile drawer; the drawer is never collapsed.
  const renderNavLinks = (isCollapsed: boolean) =>
    NAV_ITEMS.map((item) => {
      const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
      return (
        <Link
          key={item.href}
          href={item.href}
          title={isCollapsed ? item.label : undefined}
          onClick={() => setIsMobileNavOpen(false)}
          className={`relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
            isCollapsed ? "justify-center px-0" : ""
          } ${
            active
              ? "bg-[var(--color-blue-lightest)] text-[var(--color-blue)]"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          {active && (
            <span className="absolute -left-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[var(--color-blue)]" />
          )}
          {item.icon(active)}
          {!isCollapsed && item.label}
        </Link>
      );
    });

  return (
    <div className="flex min-h-screen w-full bg-[#F9FAFB]">
      <aside
        className={`relative hidden shrink-0 border-r border-gray-100 bg-white lg:sticky lg:top-0 lg:block lg:h-screen ${
          mounted ? "transition-[width] duration-200 ease-in-out" : ""
        } ${collapsed ? "lg:w-[88px]" : "lg:w-[280px]"}`}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex h-[88px] shrink-0 items-center justify-center border-b border-gray-100 px-4">
            <Link href="/" aria-label="Go to home page">
              <Image
                src={SpoilertLogo}
                alt="Spoilert"
                width={collapsed ? 36 : 45}
                height={collapsed ? 36 : 45}
              />
            </Link>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-4">
            {renderNavLinks(collapsed)}
          </nav>

          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex shrink-0 items-center gap-2 border-t border-gray-100 px-4 py-4 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className={`shrink-0 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
            >
              <path d="M15 6l-6 6 6 6" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.5 6v12" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-[88px] shrink-0 items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 sm:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileNavOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-[#212529] sm:text-xl">
                Welcome Back{displayName && `, ${displayName}`}
              </h1>
              <p className="truncate text-sm text-gray-400">
                Here&rsquo;s a quick overview of Spoilert&rsquo;s latest activities
              </p>
            </div>
          </div>

          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-label="Open profile menu"
              className="flex items-center gap-2 focus:outline-none"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M4.5 19c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className={`shrink-0 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 z-50 mt-2 w-44 rounded-lg border border-gray-200 bg-white shadow-lg">
                <button
                  type="button"
                  className="block w-full rounded-lg px-4 py-3 text-left text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsLogoutConfirmOpen(true);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-8 sm:px-10">
          {mounted && isInstitution ? children : null}
        </main>
      </div>

      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMobileNavOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex h-[88px] shrink-0 items-center justify-between border-b border-gray-100 px-4">
              <Link href="/" aria-label="Go to home page" onClick={() => setIsMobileNavOpen(false)}>
                <Image src={SpoilertLogo} alt="Spoilert" width={45} height={45} />
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-4">
              {renderNavLinks(false)}
            </nav>
          </aside>
        </div>
      )}

      <LogoutConfirmModal
        open={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        redirectTo="/institution/login"
      />
    </div>
  );
};

export default InstitutionDashboardLayout;
