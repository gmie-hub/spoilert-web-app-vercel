"use client";

import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { usePathname } from "next/navigation";

import AddCircleIcon from "@spt/assets/icons/add-circle.svg";
import BookIcon from "@spt/assets/icons/book.svg";
import CommunityIcon from "@spt/assets/icons/community.svg";
import HomeIcon from "@spt/assets/icons/home.svg";
import ProfileIcon from "@spt/assets/icons/profile.svg";

import FirstSection from "./firstSection";
import SecondSection from "./secondSection";

const Header = () => {
  const pathname = usePathname();

  const navLinks = [
    { icon: HomeIcon, name: "Home", href: "/home" },
    { icon: BookIcon, name: "Explore", href: "/my-learnings" },
    { icon: AddCircleIcon, name: "Create Spoil", href: "/create-spoil" },
    { icon: CommunityIcon, name: "Community", href: "/community" },
    { icon: ProfileIcon, name: "Profile", href: "/profile" },
  ];

  return (
    <header>
      <Stack>
        <FirstSection navLinks={navLinks} activePath={pathname} />

        <Divider className="hidden md:block" />

        <SecondSection navLinks={navLinks} activePath={pathname} />

        <Divider className="hidden md:block" />
      </Stack>
    </header>
  );
};

export default Header;
