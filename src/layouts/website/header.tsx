"use client";

import React, { useRef, useState } from "react";

import Stack from "@mui/material/Stack";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import CreateSpoilIcon from "@spt/assets/icons/add-circle.svg";
import ArrowDownIcon from "@spt/assets/icons/arrow-down.svg";
import Learnings from "@spt/assets/icons/book.svg";
import ChatIcon from "@spt/assets/icons/chat.svg";
import FilterIcon from "@spt/assets/icons/filter-search.svg";
import FrameIcon from "@spt/assets/icons/Frame 1618872992.svg";
import Logo from "@spt/assets/icons/Group(2).svg";
import Home from "@spt/assets/icons/home.svg";
import MenuIcon from "@spt/assets/icons/menu.svg";
import CommunityIcon from "@spt/assets/icons/messages-2.svg";
import NotificationIcon from "@spt/assets/icons/notification.svg";
import ProfileNavIcon from "@spt/assets/icons/profileNav.svg";
import SearchIcon from "@spt/assets/icons/search-normal.svg";
import UserImage from "@spt/assets/icons/user.svg";
import Button from "@spt/components/button";
import { useGetUserVerificationDetails } from "@spt/hooks/apiRequests/useGetUserVerificationDetailsQuery";
import useClickOutside from "@spt/hooks/useClickOutside";
import LoginPromptModal from "@spt/layouts/website/LoginPromptModal";
import LogoutConfirmModal from "@spt/layouts/website/LogoutConfirmModal";
import MobileMenu from "@spt/layouts/website/MobileMenu";
import { useAuthStore } from "@spt/store/authStore";

type NavLink = {
  icon: string | any;
  name: string;
  href: string;
  /** When true, logged-out users get a login prompt instead of navigating. */
  requiresAuth?: boolean;
};



const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const router = useRouter();
  const pathname = usePathname();

  const setAuth = useAuthStore((state) => state.setAuth);

  const authUser = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const { userVerificationDetails } = useGetUserVerificationDetails(authUser?.id || 0);

  // Extract complex expressions for useEffect dependencies
  const verificationStatus = userVerificationDetails?.data?.[0]?.status;
  const authVerificationStatus = authUser?.verification_status;
  const authUserId = authUser?.id;

  React.useEffect(() => {
    if (authUser && verificationStatus !== undefined) {
      // Only update the store if the verification status actually changed
      if (authVerificationStatus !== verificationStatus) {
        const token = useAuthStore.getState().token ?? "";
        setAuth({
          user: { ...authUser, verification_status: verificationStatus },
          token,
        });
      }
    }
  }, [verificationStatus, authVerificationStatus, authUserId, authUser, setAuth]);


  const createSpoilHref =
    userVerificationDetails?.data?.[0]?.status === 1
      ? "/create-spoils"
      // : authUser?.kyc_verified_at === null
      : "/create-spoils/kyc-process"
      // : "/create-spoils";

  const navLinks: NavLink[] = [
    { icon: Home, name: "Home", href: "/" },
    { icon: Learnings, name: "My Learnings", href: "/my-learnings", requiresAuth: true },
    { icon: CreateSpoilIcon, name: "Create spoylz", href: createSpoilHref, requiresAuth: true },
    { icon: CommunityIcon, name: "Community", href: "/community", requiresAuth: true },
    ...(authUser
      ? [{ icon: ProfileNavIcon, name: "Profile", href: "/profile" }]
      : []),
  ];

  // Intercept clicks on protected links while logged out: block navigation
  // and surface a login prompt instead. We only block once we're sure the
  // auth store has hydrated, so logged-in users are never wrongly stopped.
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: NavLink
  ) => {
    if (link.requiresAuth && hasHydrated && !authUser) {
      e.preventDefault();
      setIsMenuOpen(false);
      setIsLoginPromptOpen(true);
    }
  };


  const icons = [
    { alt: "notification", src: NotificationIcon },
    { alt: "chat", src: ChatIcon },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[100px]">
      {/* ================= TOP NAV ROW ================= */}
      <div className="mx-auto flex max-w-[1400px] items-center justify-between py-3 sm:py-4">
        {/* LEFT SIDE: LOGO + NAV LINKS */}
        <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src={Logo}
              alt="Logo"
              width={45}
              height={45}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-[45px] md:h-[45px]"
            />
          </Link>

          {/* NAV LINKS - Full labels shown on xl+ only */}
          <nav className="hidden xl:flex items-center gap-2 2xl:gap-3">
            {navLinks?.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${
                    isActive
                      ? "bg-[#0B2C3D] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Image
                    src={link?.icon}
                    alt="icon"
                    width={16}
                    height={16}
                    className={isActive ? "brightness-0 invert" : ""}
                  />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* NAV LINKS - Condensed icons for md & lg screens (mobile uses the toggle, xl shows full labels) */}
          <nav className="hidden md:flex xl:hidden items-center gap-1">
            {navLinks?.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`group relative flex items-center justify-center rounded-full p-2.5 transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#0B2C3D] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Image
                    src={link?.icon}
                    alt={link.name}
                    width={20}
                    height={20}
                    className={isActive ? "brightness-0 invert" : ""}
                  />
                  {/* Tooltip */}
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#0B2C3D] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 pointer-events-none z-50">
                    {link.name}
                    {/* Tooltip arrow */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#0B2C3D]" />
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RIGHT SIDE: AUTH BUTTONS - Hidden on mobile, shown on md+ */}
        {hasHydrated && !authUser && (
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <Button
              variant="outline"
              className="rounded-full px-4 md:px-6 lg:px-8 xl:px-14 text-sm"
              onClick={() => router.push("/auth/signin")}
            >
              Login
            </Button>

            <Button
              variant="default"
              className="rounded-full px-4 md:px-5 lg:px-6 text-sm whitespace-nowrap"
              onClick={() => router.push("/auth/signup")}
            >
              <span className="hidden sm:inline">Sign Up For Free</span>
              <span className="sm:hidden">Sign Up</span>
            </Button>
          </div>
        )}

        {hasHydrated && authUser && (
          <Stack direction="row" spacing={{ xs: 2, md: 2 }} alignItems="center" className="md:flex">
            {icons.map((icon, index) => {
              const handleIconClick = () => {
                // navigate to notifications page when notification icon is clicked
                if (icon.alt === "notification") {
                  router.push("/notifications");
                  return;
                }

                if (icon.alt === "chat") {
                  router.push("/messages");
                }
              };

              return (
                <div
                  key={index}
                  role="button"
                  onClick={handleIconClick}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleIconClick();
                  }}
                  className="bg-gray-faint h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={14.5}
                    height={14.5}
                    className="md:h-[24px] md:w-[24px]"
                  />
                </div>
              );
            })}

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="cursor-pointer flex items-center gap-2 focus:outline-none"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-label="Open profile menu"
                type="button"
              >
                <Image
                  src={authUser.avatar || UserImage}
                  alt="user"
                  width={24}
                  height={24}
                  className="md:w-[40px] md:h-[40px] rounded-full"
                />
                <p className="hidden md:block">{`${authUser?.first_name} ${authUser?.last_name}`}</p>
                <Image
                  src={ArrowDownIcon}
                  alt="arrow-down"
                  width={16}
                  height={16}
                  className="md:w-[24px] md:h-[24px]"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg"
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
          </Stack>
        )}

        {/* MOBILE MENU ICON - shown on mobile only (below md) */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <Image src={MenuIcon} alt="Menu" width={26} height={26} />
        </button>
      </div>

      {/* ================= SEARCH ROW ================= */}
      <div className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-[1400px] justify-center py-3 sm:py-4 px-2 sm:px-0">
          <div className="relative w-full max-w-[650px]">
            {/* Search icon inside input */}
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Image
                src={SearchIcon}
                alt="search"
                width={18}
                height={18}
                className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
              />
            </div>

            <input
              type="text"
              placeholder="Search for a Spoylz, tutor, Institution..."
              className="
                w-full rounded-full border border-gray-300 bg-gray-50 
                pl-10 sm:pl-12 pr-20 sm:pr-28 md:pr-32 py-2.5 sm:py-3 text-xs sm:text-sm 
                outline-none focus:border-[#0B2C3D] placeholder:text-xs sm:placeholder:text-sm
              "
            />

            {/* Right icons */}
            <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 rounded-full px-2 sm:px-4 py-2 flex items-center gap-2 sm:gap-4">
              <Image
                className="cursor-pointer w-4 h-4 sm:w-5 sm:h-5"
                src={FilterIcon}
                alt="Filter"
                width={20}
                height={20}
              />
              <Image
                className="cursor-pointer w-6 h-6 sm:w-8 sm:h-8"
                src={FrameIcon}
                alt="Frame"
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE/TABLET DROPDOWN MENU ================= */}
      <MobileMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        navLinks={navLinks}
        pathname={pathname}
        authUser={authUser}
        setIsLogoutConfirmOpen={setIsLogoutConfirmOpen}
        router={router}
        onNavLinkClick={handleNavClick}
      />

      {/* ================= LOGOUT CONFIRMATION MODAL ================= */}
      <LogoutConfirmModal
        open={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
      />

      {/* ================= LOGIN PROMPT (for logged-out users) ================= */}
      <LoginPromptModal
        open={isLoginPromptOpen}
        onClose={() => setIsLoginPromptOpen(false)}
      />
    </header>
  );
};

export default Header;
