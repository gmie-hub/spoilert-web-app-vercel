"use client";

import React from "react";

import Image from "next/image";

import BookIcon from "@spt/assets/icons/bookIcon.svg";
import ClockIcon from "@spt/assets/icons/clock.svg";
import Profile from "@spt/assets/icons/profile-2user.svg";
import { SpoilDetailsData } from "@spt/utils/spoils";

import Button from "../../../../components/button";
import Card from "../../../../components/card";
import HStack from "../../../../components/hstack";
import VStack from "../../../../components/vstack";

interface SpoilPricingCardProps {
  price: string;
  spoil: SpoilDetailsData;
  shouldContinue: boolean;
  isFreeSpoil: boolean;
  onPrimaryClick: () => void;
  onSponsor: () => void;
}

export const SpoilPricingCard: React.FC<SpoilPricingCardProps> = ({
  price,
  spoil,
  shouldContinue,
  isFreeSpoil,
  onPrimaryClick,
  onSponsor,
}) => (
  <div className="hidden lg:block relative">
    <div className="absolute -top-36 right-0 w-[340px]">
      <Card className="rounded-2xl bg-white shadow-2xl ring-1 ring-gray-100 px-6 md:min-w-sm">
        <VStack spacing="gap-6" className="w-full items-start">
          <p className="text-lg font-semibold text-black">{price}</p>

          <Button
            variant="darkBlue"
            className="w-full py-3"
            onClick={onPrimaryClick}
          >
            {shouldContinue
              ? "Continue Learning"
              : isFreeSpoil
                ? "Start Spoil"
                : "Buy Spoil"}
          </Button>

         {!isFreeSpoil && (
          <Button
            variant="lightBlue"
            className="w-full py-3 bg-white text-sky-700 border border-sky-100"
            onClick={onSponsor}
          >
            Sponsor Spoil
          </Button>
         )}

          <div className="w-full border-t pt-4 border-[#E7E7E7]">
            <HStack
              spacing="gap-2"
              className="text-xs text-gray-500 whitespace-nowrap flex-wrap"
            >
              <span className="flex items-center gap-1 px-3 py-2 bg-gray-50 text-xs rounded-2xl">
                <Image src={Profile} alt="Enrolled users" width={20} height={20} />
                {spoil.enrolled_users ?? 0} Enrolled
              </span>
              <span className="flex items-center gap-1 px-3 py-2 bg-gray-50 text-xs rounded-2xl">
                <Image src={BookIcon} alt="Modules" width={20} height={20} />
                {spoil.modules_no ?? 0} Modules
              </span>
              <span className="flex items-center gap-1 px-3 py-2 bg-gray-50 text-xs rounded-2xl">
                <Image src={ClockIcon} alt="Lessons" width={20} height={20} />
                {spoil.lessons_no ?? 0} Lessons
              </span>
            </HStack>
          </div>
        </VStack>
      </Card>
    </div>
  </div>
);

interface SpoilMobileCTAProps {
  shouldContinue: boolean;
  isFreeSpoil: boolean;
  onPrimaryClick: () => void;
  onSponsor: () => void;
}

export const SpoilMobileCTA: React.FC<SpoilMobileCTAProps> = ({
  shouldContinue,
  isFreeSpoil,
  onPrimaryClick,
  onSponsor,
}) => (
  <div className="lg:hidden">
    <VStack spacing="gap-4" className="pt-4 w-full sm:w-1/2">
      <Button
        variant="lightBlue"
        className="w-full py-3 bg-sky-50 text-sky-700 border border-sky-100"
        onClick={onSponsor}
      >
        Sponsor Spoil
      </Button>
      <Button
        variant="darkBlue"
        className="w-full py-3 cursor-pointer"
        onClick={onPrimaryClick}
      >
        {shouldContinue
          ? "Continue Learning"
          : isFreeSpoil
            ? "Start Spoil"
            : "Buy Spoil"}
      </Button>
    </VStack>
  </div>
);
