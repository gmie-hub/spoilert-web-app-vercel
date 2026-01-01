import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@spt/assets/icons/logo.svg";
import Button from "@spt/components/button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Spoils", href: "/explore" },
  { name: "About Us", href: "/about" },
  { name: "FAQ", href: "/faq" },
];

const Header = () => {
  // For demonstration, we'll consider "Home" as the active link.
  // In a real app, you'd use `usePathname` from `next/navigation`.
  const activePath = "/";

  return (
    <header className="sticky top-0 z-10 border-b border-gray-lightest bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" aria-label="Home">
          <Image src={Logo} alt="Spoilert Logo" width={120} height={40} />
        </Link>

        {/* Navigation and Auth */}
        <div className="flex items-center gap-8">
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
            <Link href="/login" className="text-gray hover:text-blue transition-colors duration-300 font-semibold">
              Login
            </Link>

            <Button variant="default">
              Sign Up For Free
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
