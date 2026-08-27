import React from "react";

import Image from "next/image";
import Link from "next/link";

import Button from "@spt/components/button";

interface NavLink {
  icon: string | any;
  name: string;
  href: string;
  requiresAuth?: boolean;
}

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  navLinks: NavLink[];
  pathname: string | null;
  authUser: any;
  setIsLogoutConfirmOpen: (open: boolean) => void;
  router: any;
  /** Called when a nav link is clicked; may preventDefault to block navigation. */
  onNavLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  navLinks,
  pathname,
  authUser,
  setIsLogoutConfirmOpen,
  router,
  onNavLinkClick,
}) => {
  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden max-h-[70vh] overflow-y-auto border-t border-gray-200 bg-white py-4 sm:py-5 space-y-4 sm:space-y-6 px-4 sm:px-6">
      {/* Mobile Nav Links */}
      <div className="flex flex-col gap-1 sm:gap-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#0B2C3D] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={(e) => {
                onNavLinkClick?.(e, link);
                setIsMenuOpen(false);
              }}
            >
              <Image
                src={link?.icon}
                alt="icon"
                width={18}
                height={18}
                className={isActive ? "brightness-0 invert" : ""}
              />
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Mobile Auth Buttons - show login/signup when logged out; show logout when logged in */}
      <div className="md:hidden flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
        {authUser ? (
          <Button
            variant="outline"
            className="w-full sm:w-1/2 rounded-full"
            onClick={() => {
              setIsMenuOpen(false);
              setIsLogoutConfirmOpen(true);
            }}
          >
            Logout
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              className="w-full sm:w-1/2 rounded-full"
              onClick={() => {
                router.push("/auth/signin");
                setIsMenuOpen(false);
              }}
            >
              Login
            </Button>

            <Button
              variant="default"
              className="w-full sm:w-1/2 rounded-full"
              onClick={() => {
                router.push("/auth/signup");
                setIsMenuOpen(false);
              }}
            >
              Sign Up For Free
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
