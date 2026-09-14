"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
];

interface InstitutionDashboardLayoutProps {
  children: React.ReactNode;
  institutionName?: string;
}

const InstitutionDashboardLayout = ({
  children,
  institutionName = "University of Lagos",
}: InstitutionDashboardLayoutProps) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_STORAGE_KEY) === "1");
    } catch {
      // ignore if localStorage is unavailable
    } finally {
      setMounted(true);
    }
  }, []);

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

  return (
    <div className="flex min-h-screen w-full bg-[#F9FAFB]">
      <aside
        className={`relative hidden shrink-0 border-r border-gray-100 bg-white lg:sticky lg:top-0 lg:block lg:h-screen ${
          mounted ? "transition-[width] duration-200 ease-in-out" : ""
        } ${collapsed ? "lg:w-[88px]" : "lg:w-[280px]"}`}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex h-[88px] shrink-0 items-center justify-center border-b border-gray-100 px-4">
            {collapsed ? (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-blue)] text-sm font-semibold text-white">
                S
              </span>
            ) : (
              <span className="w-full truncate text-lg font-semibold tracking-wide text-[#212529]">LOGO</span>
            )}
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-4">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    collapsed ? "justify-center px-0" : ""
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
                  {!collapsed && item.label}
                </Link>
              );
            })}
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
        <header className="flex h-[88px] shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 sm:px-10">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-[#212529] sm:text-xl">
              Welcome Back, {institutionName}
            </h1>
            <p className="truncate text-sm text-gray-400">
              Here&rsquo;s a quick overview of Spoilert&rsquo;s latest activities
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4.5 19c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden px-6 py-8 sm:px-10">{children}</main>
      </div>
    </div>
  );
};

export default InstitutionDashboardLayout;
