import Stack from "@mui/material/Stack";
import Image from "next/image";
import Link from "next/link";

import { MainHeaderProps } from "@spt/types/layout";

const SecondSection: FC<MainHeaderProps> = ({ navLinks, activePath }) => {
  return (
    <nav className="hidden md:block">
      <Stack
        direction="row"
        spacing={{ xs: 2, md: 4 }}
        alignItems="center"
        paddingBlock={{ xs: 2, md: 3 }}
        paddingInline={{ xs: 2, md: 10 }}
      >
        {navLinks.map((link) => (
          <Stack
            key={link.name}
            direction="row"
            spacing={1}
            alignItems="center"
            className={`px-4 py-2 rounded-[12px] transition-colors duration-300 group ${activePath === link.href ? "bg-blue" : "hover:bg-blue"}`}
          >
            <Image
              key={link.name}
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

            <Link
              href={link.href}
              className={`transition-colors ${
                activePath === link.href
                  ? "text-white"
                  : "group-hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          </Stack>
        ))}
      </Stack>
    </nav>
  );
};

export default SecondSection;
