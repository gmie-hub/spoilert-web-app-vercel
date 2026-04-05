"use client";

import React, { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

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
import useBuySpoilMutation from "@spt/hooks/apiRequests/useBuySpoilMutation";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";
import { SpoilDetailsData } from "@spt/utils/spoils";

import Button from "../../../../components/button";
import Card from "../../../../components/card";
import HStack from "../../../../components/hstack";
import VStack from "../../../../components/vstack";

import BuySpoilPaymentModal from "./BuySpoilPaymentModal";
import Details from "./details";

interface SpoilDetailsProps {
  spoilId: number | string;
}

const formatExpiryDate = (value?: string | null) => {
  if (!value) return "No expiry date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `Expires on ${date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
};

const formatPrice = (spoil: SpoilDetailsData) => {
  const amount = spoil.display_amount ?? spoil.amount;

  if (spoil?.pricing?.toLowerCase() === "free") {
    return "Free";
  }

  if (typeof amount === "number") {
    return `₦${amount?.toLocaleString()}`;
  }

  return spoil?.pricing || "Pricing unavailable";
};

const getTutorName = (spoil: SpoilDetailsData) => {
  const firstName = spoil.tutor?.first_name ?? "";
  const lastName = spoil.tutor?.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Unknown tutor";
};

const getTutorInitials = (spoil: SpoilDetailsData) => {
  const firstInitial = spoil.tutor?.first_name?.[0] ?? "";
  const lastInitial = spoil.tutor?.last_name?.[0] ?? "";

  return `${firstInitial}${lastInitial}`.toUpperCase() || "NA";
};

const LoadingState = () => (
  <section className="w-full bg-white relative">
    <div className="h-[280px] sm:h-[320px] md:h-[420px] w-full animate-pulse bg-gray-100" />
    <section className="px-5 lg:px-25 py-8">
      <div className="space-y-4">
        <div className="h-4 w-48 rounded bg-gray-100" />
        <div className="h-10 w-80 rounded bg-gray-100" />
        <div className="h-24 w-full max-w-3xl rounded bg-gray-100" />
      </div>
    </section>
  </section>
);

const ErrorState = ({ message }: { message: string }) => (
  <section className="px-5 lg:px-25 py-16">
    <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
      {message}
    </div>
  </section>
);

const EmptyState = () => (
  <section className="px-5 lg:px-25 py-16">
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
      Spoil details are unavailable.
    </div>
  </section>
);

const SpoilDetails: React.FC<SpoilDetailsProps> = ({ spoilId }) => {
  const router = useRouter();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { buySpoilHandler, isLoading: isBuyingSpoil } = useBuySpoilMutation();
  const { data: spoil, isLoading, isError, errorMessage } =
    useGetSpoilDetailsQuery(spoilId);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message={errorMessage} />;
  }

  if (!spoil) {
    return <EmptyState />;
  }

  const tutorName = getTutorName(spoil);
  const heroImage = spoil.cover_image_url || HeroImage3;
  const isFallbackHeroImage = !spoil.cover_image_url;
  const isFreeSpoil = spoil?.pricing?.toLowerCase() === "free";
  const price = formatPrice(spoil);
  const spoilOverviewHref = `/spoil/${spoil.id}`;
  const hasProgress = Number(spoil?.percentage_completed ?? 0) > 0;
  const isEnrolled = Boolean(spoil?.is_enrolled);
  const shouldContinue = isEnrolled || hasProgress;
  const spoilAmount =
    typeof spoil.display_amount === "number"
      ? spoil.display_amount
      : typeof spoil.amount === "number"
        ? spoil.amount
        : 0;
  const certificateFee = Number(spoil.certificate_fee) || 0;

  const handleMakePayment = async () => {
    const response = await buySpoilHandler(spoil.id, "FLUTTERWAVE");

    if (response) {
      setIsPaymentModalOpen(false);
    }

    return response;
  };

  const handlePrimaryCtaClick = async () => {
    // If the user is already enrolled or has progress, go straight to the spoil start
    if (shouldContinue) {
      router.push(`/spoil/${spoil.id}/start`);
      return;
    }
    if (isFreeSpoil) {
      const response = await handleMakePayment();

      if (response) {
        router.push(spoilOverviewHref);
      }

      return;
    }

    setIsPaymentModalOpen(true);
  };

  return (
    <section className="w-full bg-white relative">
      <div className="relative w-full h-[280px] sm:h-[320px] md:h-[420px] overflow-hidden">
        <Image
          src={heroImage}
          alt={spoil.title}
          fill
          sizes="100vw"
          quality={95}
          placeholder={isFallbackHeroImage ? "blur" : "empty"}
          className="object-cover"
          priority
        />
      </div>

      <section className="px-5 lg:px-25">
        <div className="relative pb-10 grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="pt-8">
            {/* <p className="text-sm text-gray-500 mb-1">{buildMetaLabel(spoil)}</p> */}

            <h1 className="text-lg text-[#212529] md:text-xl">
              {spoil.title}
            </h1>

            <HStack spacing="gap-2" className="mt-3 flex-wrap">
              <span className="px-3 py-1 rounded-md bg-blue-lightest text-blue text-sm">
                {spoil.category?.name || "Uncategorized"}
              </span>

              <span className="px-3 py-1 rounded-md border border-gray-lightest text-black text-xs flex items-center gap-1">
                <Image src={StarIcon} alt="Star rating" width={20} height={20} />
                {(spoil.average_rating ?? 0).toFixed(1)} ({spoil.ratings_count ?? 0})
              </span>
            </HStack>

            <div className="w-full pt-4 block lg:hidden">
              <HStack
                spacing="gap-2"
                className="text-xs text-gray-500 whitespace-nowrap flex-wrap"
              >
                <span className="flex items-center gap-1 px-3 py-2 bg-[#F6F6F6] rounded-md">
                  <Image src={Profile} alt="Enrolled users" width={20} height={20} />
                  {spoil.enrolled_users ?? 0} Enrolled
                </span>
                <span className="flex items-center gap-1 px-3 py-2 bg-[#F6F6F6] rounded-md">
                  <Image src={BookIcon} alt="Modules" width={20} height={20} />
                  {spoil.modules_no ?? 0} Modules
                </span>
                <span className="flex items-center gap-2 px-3 py-2 bg-[#F6F6F6] rounded-md">
                  <Image src={ClockIcon} alt="Lessons" width={20} height={20} />
                  <p className="text-sm">{spoil.lessons_no ?? 0} Lessons</p>
                </span>
              </HStack>
            </div>

            <HStack spacing="gap-2" className="mt-4 text-blue">
              <button className="flex items-center gap-2 hover:text-black border border-[#E0E0E0] px-3 py-1 rounded-lg">
                <Image src={SaveIcon} alt="Save spoil" width={15} height={15} />
                Save
              </button>
              <button className="flex items-center gap-2 hover:text-black border border-[#E0E0E0] px-3 py-1 rounded-lg">
                <Image src={BlueShareIcon} alt="Share spoil" width={20} height={20} />
                Share
              </button>
            </HStack>

            <HStack spacing="gap-4" className="mt-4 text-sm text-gray-dark">
              <div className="flex items-center gap-1 hover:text-black">
                <Image src={ThumbUp} alt="Likes" width={20} height={20} />
                <p>{spoil.likes_count ?? 0}</p>
              </div>
              <div className="flex items-center gap-1 hover:text-black">
                <Image src={ShareIcon} alt="Shares" width={20} height={20} />
                <p>{spoil.shares_count ?? 0}</p>
              </div>
            </HStack>

            <p className="mt-4 text-red flex items-center gap-1">
              <Image src={Calender} alt="Expiry date" width={20} height={20} />
              {formatExpiryDate(spoil.expires_at)}
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
              {spoil.tutor?.avatar ? (
                <div className="relative h-6 w-6 overflow-hidden rounded-full bg-gray-200">
                  <Image
                    src={spoil.tutor.avatar}
                    alt={tutorName}
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="w-6 h-6 rounded-full bg-gray flex items-center justify-center text-sm">
                  {getTutorInitials(spoil)}
                </span>
              )}
              {tutorName}
            </div>

            <div className="lg:hidden">
              <VStack spacing="gap-4" className="pt-4 w-full sm:w-1/2">
                <Button
                  variant="lightBlue"
                  className="w-full py-3 bg-sky-50 text-sky-700 border border-sky-100"
                >
                  Sponsor Spoil
                </Button>
                <Button
                  variant="darkBlue"
                  className="w-full py-3 cursor-pointer"
                  onClick={handlePrimaryCtaClick}
                >
                    {shouldContinue ? "Continue Learning" : isFreeSpoil ? "Start Spoil" : "Buy Spoil"}
                </Button>
              </VStack>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="absolute -top-36 right-0 w-[340px]">
              <Card className="rounded-2xl bg-white shadow-2xl ring-1 ring-gray-100 px-6 md:min-w-sm">
                <VStack spacing="gap-6" className="w-full items-start">
                  <p className="text-lg font-semibold text-black">{price}</p>

                  <Button
                    variant="darkBlue"
                    className="w-full py-3"
                    onClick={handlePrimaryCtaClick}
                  >
                    {shouldContinue ? "Continue Learning" : isFreeSpoil ? "Start Spoil" : "Buy Spoil"}
                  </Button>

                  <Button
                    variant="lightBlue"
                    className="w-full py-3 bg-white text-sky-700 border border-sky-100"
                  >
                    Sponsor Spoil
                  </Button>

                  <div className="w-full border-t pt-4 border-[#E7E7E7]">
                    <HStack
                      spacing="gap-2"
                      className="text-xs text-gray-500 whitespace-nowrap flex-wrap"
                    >
                      <span className="flex items-center gap-1 px-3 py-2 bg-gray-50 text-xs rounded-2xl">
                        <Image
                          src={Profile}
                          alt="Enrolled users"
                          width={20}
                          height={20}
                        />
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
        </div>

        <Details spoil={spoil} />

        <BuySpoilPaymentModal
          open={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          spoilTitle={spoil.title}
          costFee={spoilAmount}
          certificateFee={certificateFee}
          onMakePayment={handleMakePayment}
          isMakingPayment={isBuyingSpoil}
        />
      </section>
    </section>
  );
};

export default SpoilDetails;
