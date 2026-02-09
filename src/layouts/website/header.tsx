"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Logo from "@spt/assets/icons/logo.svg";
import MenuIcon from "@spt/assets/icons/menu.svg";
import Button from "@spt/components/button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Spoils", href: "/explore" },
  { name: "About Us", href: "/about" },
  { name: "FAQ", href: "/faq" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const activePath = "/";

  return (
    <header className="sticky top-0 z-10 px-24 border-b border-gray-lightest bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" aria-label="Home">
          <Image src={Logo} alt="Spoilert Logo" width={120} height={40} />
        </Link>

        {/* Desktop Navigation and Auth */}
        <div className="hidden md:flex items-center gap-8">
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-gray hover:text-blue transition-colors duration-300 ${
                      activePath === link.href ? "text-blue font-semibold" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

           <div className="flex items-center gap-6">
            <Link
              href="/auth/signin"
              className="text-gray hover:text-blue transition-colors duration-300 font-semibold"
            >
              Login
            </Link>
            <Button
              onClick={() => router.push("/create-spoils")}
              variant="outline"
            >
              Create Spoil
            </Button>

            <Button
              onClick={() => router.push("/auth/signup")}
              variant="default"
            >
              Sign Up For Free
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            className="p-2 rounded-md hover:bg-gray-lightest"
          >
            <Image src={MenuIcon} alt="Menu icon" width={24} height={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  activePath === link.href
                    ? "bg-blue-lightest text-blue-dark"
                    : "text-gray hover:bg-gray-lightest"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-lightest pt-4 pb-3">
            <div className="px-5">
              <Link
                href="/login"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray hover:bg-gray-lightest"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>

            <div className="mt-3 px-5">
              <Button
                variant="default"
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up For Free
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
