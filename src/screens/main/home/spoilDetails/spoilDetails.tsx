import React from "react";

import Image from "next/image";

import BlueShareIcon from "@spt/assets/icons/blueshare-2 (6) 1.svg";
import BookIcon from "@spt/assets/icons/bookIcon.svg";
import Calender from "@spt/assets/icons/calendar.svg";
import ClockIcon from "@spt/assets/icons/clock.svg";
import Profile from "@spt/assets/icons/profile-2user.svg";
import ShareIcon from "@spt/assets/icons/share-2 (6) 1.svg";
import SaveIcon from "@spt/assets/icons/share.svg";
import StarIcon from "@spt/assets/icons/star.svg";
import ThumbUp from "@spt/assets/icons/vuesax.svg";
import HeroImage3 from "@spt/assets/images/Hero.png";

import Button from "../../../../components/button";
import Card from "../../../../components/card";
import HStack from "../../../../components/hstack";
import VStack from "../../../../components/vstack";

import Details from "./details";

const SpoilDetails: React.FC = () => {
  return (
    <section className="w-full bg-white relative">
      {/* HERO */}
      <div className="relative w-full h-[280px] sm:h-[320px] md:h-[420px] overflow-hidden">
        <Image
          src={HeroImage3.src}
          alt="spoil media"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* MAIN WRAPPER */}
      <section className="px-5 lg:px-25">
        <div className="relative   pb-10 grid lg:grid-cols-[1fr_360px] gap-8">
          {/* LEFT DETAILS */}
          <div className="pt-6">
            <p className="text-sm text-gray-500 mb-1">
              BCH 404 • Biological Pharmacology
            </p>

            <HStack spacing="gap-3" className="mt-4 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                UI/UX Design
              </span>

              <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm flex items-center gap-1">
                
                <Image src={StarIcon} alt="StarIcon" width={20} height={20} />
                4.5 (16)
              </span>
            </HStack>
            <div className="w-full pt-4 block lg:hidden">
              <HStack
                spacing="gap-2"
                className="text-xs text-gray-500 whitespace-nowrap"
              >
                <span className="flex items-center gap-1 px-3 py-2 bg-gray-50 rounded-full">
                  <Image src={Profile} alt="Profile" width={20} height={20} />{" "}
                  12 Enrolled
                </span>
                <span className="flex items-center gap-1 px-3 py-2 bg-gray-50 rounded-full">
                  <Image src={BookIcon} alt="BookIcon" width={20} height={20} />{" "}
                  5 Modules
                </span>
                <span className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full">
                  <Image
                    src={ClockIcon}
                    alt="ClockIcon"
                    width={20}
                    height={20}
                  />
                  <p className="text-sm">12hrs 10min</p>
                </span>
              </HStack>
            </div>

            <HStack spacing="gap-4" className="mt-4 text-sm text-gray-600">
              <button className="flex items-center gap-1 hover:text-black">
                <Image src={SaveIcon} alt="rating" width={11} height={10} />
                Save
              </button>
              <button className="flex items-center gap-1 hover:text-black">
                <Image
                  src={BlueShareIcon}
                  alt="rating"
                  width={11}
                  height={15}
                />
                Share
              </button>
            </HStack>

            <HStack spacing="gap-4" className="mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-1 hover:text-black">
                <Image src={ThumbUp} alt="ThumbUp" width={16} height={16} />
                <p>12</p>
              </div>
              <div className="flex items-center gap-1 hover:text-black">
                <Image src={ShareIcon} alt="rating" width={11} height={15} />
                <p>12</p>
              </div>
            </HStack>

            <p className="mt-4 text-sm text-red-500 flex items-center gap-2">
              <Image src={Calender} alt="Calender" width={20} height={20} />
              Expires on the 25th July, 2025
            </p>

            <p className="mt-2 flex items-center gap-2 text-sm text-gray-700">
              <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                👤
              </span>
              Ogunusola Omorinola
            </p>
            {/* MOBILE ACTION */}
            <div className="lg:hidden">
              <VStack spacing="gap-4" className="pt-2 w-1/2">
                <Button
                  variant="lightBlue"
                  className="w-full py-3 bg-sky-50 text-sky-700 border border-sky-100"
                >
                  Sponsor Spoil →
                </Button>{" "}
                <Button variant="darkBlue" className="w-full py-3">
                  Buy Spoil
                </Button>
              </VStack>
            </div>
          </div>

          {/* FLOATING CARD (DESKTOP) */}
          <div className="hidden lg:block relative">
            <div className="absolute -top-36 right-0 w-[340px]">
              <Card className="rounded-2xl bg-white shadow-2xl ring-1 ring-gray-100">
                <VStack spacing="gap-6" className=" w-full items-start">
                  <p className="text-2xl font-semibold text-[#0F172A] ">
                    ₦150,000
                  </p>

                  <Button variant="darkBlue" className="w-full py-3">
                    Buy Spoil
                  </Button>

                  <Button
                    variant="lightBlue"
                    className="w-full py-3 bg-white text-sky-700 border border-sky-100"
                  >
                    Sponsor Spoil →
                  </Button>

                  <div className="w-full border-t pt-4 border-[#E7E7E7]">
                    <HStack
                      spacing="gap-2"
                      className="text-xs text-gray-500 whitespace-nowrap"
                    >
                      <span className="flex items-center gap-1 px-3 py-2 bg-gray-50 rounded-full">
                        <Image
                          src={Profile}
                          alt="Profile"
                          width={20}
                          height={20}
                        />{" "}
                        12 Enrolled
                      </span>
                      <span className="flex items-center gap-1 px-3 py-2 bg-gray-50 rounded-full">
                        <Image
                          src={BookIcon}
                          alt="book"
                          width={20}
                          height={20}
                        />{" "}
                        5 Modules
                      </span>
                      <span className="flex items-center gap-1 px-3 py-2 bg-gray-50 rounded-full">
                        <Image
                          src={ClockIcon}
                          alt="ClockIcon"
                          width={20}
                          height={20}
                        />
                        12hrs 10min
                      </span>
                    </HStack>
                  </div>
                </VStack>
              </Card>
            </div>
          </div>
        </div>

        <Details />
      </section>
    </section>
  );
};

export default SpoilDetails;
