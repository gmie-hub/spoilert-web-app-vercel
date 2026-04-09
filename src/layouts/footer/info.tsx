import Image from "next/image";
import Link from "next/link";

import PhoneIcon from "@spt/assets/icons/call.svg";
import FacebookIcon from "@spt/assets/icons/facebook.svg";
import InstagramIcon from "@spt/assets/icons/instagram.svg";
import LinkedInIcon from "@spt/assets/icons/linkedIn.svg";
import LocationIcon from "@spt/assets/icons/location.svg";
import SMSIcon from "@spt/assets/icons/sms.svg";
import XIcon from "@spt/assets/icons/x-icon.svg";
import AppStoreBadge from "@spt/assets/images/app-store.png";
import GooglePlayBadge from "@spt/assets/images/google-play.png";
import Flex from "@spt/components/flex";
import HStack from "@spt/components/hstack";
import Stack from "@spt/components/stack";

const info = [
  { icon: SMSIcon, text: "blinkersnigeria@gmail.com" },
  { icon: PhoneIcon, text: "09012345678" },
  {
    icon: LocationIcon,
    text: "18B, Onikepo Akande street, off Admiralty way, Lekki phase 1, Lagos, Nigeria",
  },
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "Explore Spoils", href: "/explore-spoils" },
  { label: "About Us", href: "/about-us" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact Us", href: "/contact-us" },
];

const socialLinks = [
  { icon: XIcon, href: "https://www.twitter.com/" },
  { icon: FacebookIcon, href: "https://www.facebook.com/" },
  { icon: InstagramIcon, href: "https://www.instagram.com/" },
  { icon: LinkedInIcon, href: "https://www.linkedin.com/" },
];

const Info = () => {
  return (
    <section className="bg-blue text-white w-full px-8 md:px-[132px] py-6 md:py-12">
      <Stack className="w-full gap-8">
        <Flex
          justifyContent="between"
          direction={{ base: "column", md: "row" }}
          className="w-full justify-between items-start flex-col md:flex-row"
          spacing="gap-8 md:gap-0"
        >
          <Stack className="gap-6">
            <h2>LOGO</h2>

            <address>
              <Stack spacing="gap-3">
                {info.map((item, index) => (
                  <Stack key={index}>
                    <HStack spacing="gap-3" alignItems="center">
                      <Image
                        src={item.icon}
                        alt={item.text}
                        width={20}
                        height={20}
                      />

                      <span>{item.text}</span>
                    </HStack>
                  </Stack>
                ))}
              </Stack>
            </address>

            <nav>
              <HStack className="flex-wrap">
                {navItems.map((item, index) => (
                  <Link key={index} href={item.href} className="mr-6 last:mr-0">
                    {item.label}
                  </Link>
                ))}
              </HStack>
            </nav>
          </Stack>

          <HStack>
            <Stack>
              <h5>Download App</h5>

              <HStack>
                <Image
                  src={AppStoreBadge}
                  alt="app-store"
                  width={134}
                  height={41}
                />
                <Image
                  src={GooglePlayBadge}
                  alt="google-play"
                  width={134}
                  height={41}
                />
              </HStack>
            </Stack>
          </HStack>
        </Flex>

        <hr className="border-gray" />

        <Flex
          justifyContent="between"
          direction={{ base: "column", md: "row" }}
          className="w-full justify-between items-center flex-col-reverse md:flex-row"
        >
          <p>© 2025 Spoilert. All rights reserved.</p>

          <HStack spacing="gap-4">
            {socialLinks.map((item, index) => (
              <Link key={index} href={item.href}>
                <Image
                  src={item.icon}
                  alt={`social-icon-${index}`}
                  width={24}
                  height={24}
                />
              </Link>
            ))}
          </HStack>

          <HStack>
            <Link href="/terms-conditions" className="underline">
              Terms
            </Link>
            <p>•</p>
            <Link href="/privacy-policy" className="underline">
              Privacy
            </Link>
          </HStack>
        </Flex>
      </Stack>
    </section>
  );
};

export default Info;