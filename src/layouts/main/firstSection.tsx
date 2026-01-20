import { FC, useState } from "react";

import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import Link from "next/link";

import ArrowDownIcon from "@spt/assets/icons/arrow-down.svg";
import ChatIcon from "@spt/assets/icons/chat.svg";
import Logo from "@spt/assets/icons/logo.svg";
import MenuIcon from "@spt/assets/icons/menu.svg";
import NotificationIcon from "@spt/assets/icons/notification.svg";
import UserImage from "@spt/assets/icons/user.svg";
import { MainHeaderProps } from "@spt/types/layout";

const FirstSection: FC<MainHeaderProps> = ({ navLinks, activePath }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const icons = [
    { alt: "notification", src: NotificationIcon },
    { alt: "chat", src: ChatIcon },
  ];

  return (
    <nav>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        paddingBlock={{ xs: 2, md: 3 }}
        paddingInline={{ xs: 2, md: 10 }}
      >
        <Link href="/" aria-label="Home">
          <Image
            src={Logo}
            alt="Spoilert Logo"
            width={60}
            height={10}
            className="md:w-[120px] md:h-[40px]"
          />
        </Link>

        <Stack direction="row" spacing={{ xs: 1, md: 2 }}>
          <Stack direction="row" spacing={{ xs: 2, md: 2 }} alignItems="center">
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
                  src={UserImage}
                  alt="user"
                  width={24}
                  height={24}
                  className="md:w-[40px] md:h-[40px]"
                />
                <p className="hidden md:block">Ogunsola Omorinsola</p>
              </Stack>

              <Image
                src={ArrowDownIcon}
                alt="arrow-down"
                width={16}
                height={16}
                className="md:w-[24px] md:h-[24px]"
              />
            </Stack>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                className="p-2 rounded-md hover:bg-gray-lightest"
              >
                <Image
                  src={MenuIcon}
                  alt="menu"
                  width={16}
                  height={16}
                  className="md:w-[24px] md:h-[24px] md:hidden"
                />
              </button>
            </div>

            {/* Mobile Menu */}
            <Drawer
              anchor="left"
              open={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
            >
              <div className="w-64 p-4">
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        activePath === link.href
                          ? "bg-blue text-white"
                          : "text-gray-700 hover:bg-blue hover:text-white"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Image
                        src={link.icon}
                        alt={link.name}
                        width={16}
                        height={16}
                        className={`md:w-[24px] md:h-[24px] transition-all duration-300 ${
                          activePath === link.href
                            ? "brightness-0 invert"
                            : "group-hover:brightness-0 group-hover:invert"
                        }`}
                      />
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </Drawer>
          </Stack>
        </Stack>
      </Stack>
    </nav>
  );
};

export default FirstSection;
