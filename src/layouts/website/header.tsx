// "use client";

// import React, { useState } from "react";

// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import Logo from "@spt/assets/icons/logo.svg";
// import MenuIcon from "@spt/assets/icons/menu.svg";
// import Button from "@spt/components/button";

// const navLinks = [
//   { name: "Home", href: "/" },
//   { name: "Explore Spoils", href: "/explore" },
//   { name: "About Us", href: "/about" },
//   { name: "FAQ", href: "/faq" },
// ];

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const router = useRouter();

//   const activePath = "/";

//   return (
//     <header className="sticky top-0 z-10 px-24 border-b border-gray-lightest bg-white">
//       <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//         <Link href="/" aria-label="Home">
//           <Image src={Logo} alt="Spoilert Logo" width={120} height={40} />
//         </Link>

//         {/* Desktop Navigation and Auth */}
//         <div className="hidden md:flex items-center gap-8">
//           <nav aria-label="Main navigation">
//             <ul className="flex items-center gap-8">
//               {navLinks.map((link) => (
//                 <li key={link.name}>
//                   <Link
//                     href={link.href}
//                     className={`text-gray hover:text-blue transition-colors duration-300 ${
//                       activePath === link.href ? "text-blue font-semibold" : ""
//                     }`}
//                   >
//                     {link.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>

//            <div className="flex items-center gap-6">
//             <Link
//               href="/auth/signin"
//               className="text-gray hover:text-blue transition-colors duration-300 font-semibold"
//             >
//               Login
//             </Link>
//             <Button
//               onClick={() => router.push("/create-spoils")}
//               variant="outline"
//             >
//               Create Spoil
//             </Button>

//             <Button
//               onClick={() => router.push("/auth/signup")}
//               variant="default"
//             >
//               Sign Up For Free
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Menu Button */}
//         <div className="md:hidden">
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             aria-label="Toggle menu"
//             aria-expanded={isMenuOpen}
//             className="p-2 rounded-md hover:bg-gray-lightest"
//           >
//             <Image src={MenuIcon} alt="Menu icon" width={24} height={24} />
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden" id="mobile-menu">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className={`block px-3 py-2 rounded-md text-base font-medium ${
//                   activePath === link.href
//                     ? "bg-blue-lightest text-blue-dark"
//                     : "text-gray hover:bg-gray-lightest"
//                 }`}
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </div>

//           <div className="border-t border-gray-lightest pt-4 pb-3">
//             <div className="px-5">
//               <Link
//                 href="/login"
//                 className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray hover:bg-gray-lightest"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Login
//               </Link>
//             </div>

//             <div className="mt-3 px-5">
//               <Button
//                 variant="default"
//                 className="w-full"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Sign Up For Free
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;

// "use client";

// import React, { useState } from "react";

// import Image from "next/image";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";

// import Logo from "@spt/assets/icons/logo.svg";
// import MenuIcon from "@spt/assets/icons/menu.svg";

// import Button from "@spt/components/button";

// const navLinks = [
//   { name: "Home", href: "/" },
//   { name: "My Learnings", href: "/learnings" },
//   { name: "Create Spoil", href: "/create-spoils" },
//   { name: "Community", href: "/community" },
//   { name: "Profile", href: "/profile" },
// ];

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const router = useRouter();
//   const pathname = usePathname();

//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white px-6 lg:px-[100px]">
//       {/* ================= TOP NAV ROW ================= */}
//       <div className="mx-auto flex max-w-[1400px] items-center justify-between py-4">
//         {/* LEFT SIDE: LOGO + NAV LINKS */}
//         <div className="flex items-center gap-8">
//           {/* LOGO */}
//           <Link href="/" className="flex items-center gap-2">
//             <Image src={Logo} alt="Logo" width={45} height={45} />
//           </Link>

//           {/* NAV LINKS (Desktop Only) */}
//           <nav className="hidden lg:flex items-center gap-3">
//             {navLinks.map((link) => {
//               const isActive = pathname === link.href;

//               return (
//                 <Link
//                   key={link.name}
//                   href={link.href}
//                   className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
//                   ${
//                     isActive
//                       ? "bg-[#0B2C3D] text-white"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   {link.name}
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>

//         {/* RIGHT SIDE: AUTH BUTTONS */}
//         <div className="hidden lg:flex items-center gap-4">
//           <Button
//             variant="outline"
//             className="rounded-full px-6"
//             onClick={() => router.push("/auth/signin")}
//           >
//             Login
//           </Button>

//           <Button
//             variant="default"
//             className="rounded-full px-6"
//             onClick={() => router.push("/auth/signup")}
//           >
//             Sign Up For Free
//           </Button>
//         </div>

//         {/* MOBILE MENU ICON */}
//         <button
//           className="lg:hidden p-2 rounded-md hover:bg-gray-100"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           <Image src={MenuIcon} alt="Menu" width={26} height={26} />
//         </button>
//       </div>

//       {/* ================= SEARCH ROW (UNDER HEADER) ================= */}
//       <div className="border-t border-gray-100 bg-white">
//         <div className="mx-auto flex max-w-[1400px] justify-center py-4">
//           <div className="relative w-full max-w-[650px]">
//             <input
//               type="text"
//               placeholder="Search for a spoil, tutor, Institution..."
//               className="w-full rounded-full border border-gray-300 bg-gray-50 px-6 py-3 text-sm outline-none focus:border-[#0B2C3D]"
//             />

//             {/* Search Button */}
//             <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#0B2C3D] px-4 py-2 text-white">
//               🔍
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ================= MOBILE DROPDOWN MENU ================= */}
//       {isMenuOpen && (
//         <div className="lg:hidden border-t border-gray-200 bg-white py-5 space-y-6">
//           {/* Mobile Nav Links */}
//           <div className="flex flex-col gap-4">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className={`text-sm font-medium ${
//                   pathname === link.href ? "text-[#0B2C3D]" : "text-gray-700"
//                 }`}
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </div>

//           {/* Mobile Auth Buttons (Full Width Fixed) */}
//           <div className="w-1/2 flex  flex-col gap-3">
//             <Button
//               variant="outline"
//               className="w-full rounded-full"
//               onClick={() => router.push("/auth/signin")}
//             >
//               Login
//             </Button>

//             <Button
//               variant="default"
//               className="w-full rounded-full"
//               onClick={() => router.push("/auth/signup")}
//             >
//               Sign Up For Free
//             </Button>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;
"use client";

import React, { useState } from "react";

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
import { useAuthStore } from "@spt/store/authStore";

const navLinks = [
  { icon: Home, name: "Home", href: "/" },
  { icon: Learnings, name: "My Learnings", href: "/learnings" },
  { icon: CreateSpoilIcon, name: "Create Spoil", href: "/create-spoils" },
  { icon: CommunityIcon, name: "Community", href: "/community" },
  { icon: ProfileNavIcon, name: "Profile", href: "/profile" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const authUser = useAuthStore((state) => state.user);

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

          {/* NAV LINKS - Hidden on mobile & tablet, shown on lg+ */}
          <nav className="hidden xl:flex items-center gap-2 2xl:gap-3">
            {navLinks?.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
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

          {/* NAV LINKS - Condensed icons only for lg screens (between tablet and xl) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1">
            {navLinks?.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
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
        {!authUser && (
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

        {authUser && (
          <Stack
            direction="row"
            spacing={{ xs: 2, md: 2 }}
            alignItems="center"
            className="md:flex"
          >
            {icons.map((icon, index) => (
              <div
                key={index}
                className="bg-gray-faint h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center"
              >
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={14.5}
                  height={14.5}
                  className="md:h-[24px] md:w-[24px]"
                />
              </div>
            ))}

            <Stack
              direction="row"
              spacing={{ xs: 1, md: 2 }}
              alignItems="center"
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Image
                  src={authUser.avatar || UserImage}
                  alt="user"
                  width={24}
                  height={24}
                  className="md:w-[40px] md:h-[40px]"
                />
                <p className="hidden md:block">{`${authUser?.first_name} ${authUser?.last_name}`}</p>
              </Stack>

              <Image
                src={ArrowDownIcon}
                alt="arrow-down"
                width={16}
                height={16}
                className="md:w-[24px] md:h-[24px]"
              />
            </Stack>
          </Stack>
        )}

        {/* MOBILE/TABLET MENU ICON - shown below lg */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
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
              placeholder="Search for a spoil, tutor, Institution..."
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
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white py-4 sm:py-5 space-y-4 sm:space-y-6 px-4 sm:px-6">
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
                  onClick={() => setIsMenuOpen(false)}
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

          {/* Mobile Auth Buttons - Only show on mobile (hidden on md+ since buttons are in header) */}
          <div className="md:hidden flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
