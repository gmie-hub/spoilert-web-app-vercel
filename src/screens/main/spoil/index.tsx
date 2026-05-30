"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import ArrowLeftIcon from "@spt/assets/icons/arrow-left.svg";
import BookIcon from "@spt/assets/icons/bookIcon.svg";
import ClockIcon from "@spt/assets/icons/clock.svg";
import ProfileIcon from "@spt/assets/icons/profile-2user.svg";
import Button from "@spt/components/button";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";
import type { SpoilDetailsData } from "@spt/utils/spoils";

interface SpoilOverviewProps {
  spoilId: number | string;
}

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
  <section className="min-h-screen bg-[#F8F8F8] px-4 py-8 sm:px-6 lg:px-16">
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-10 h-6 w-20 animate-pulse rounded bg-gray-200" />
      <div className="mx-auto max-w-[640px] rounded-3xl border border-[#E9E9E9] bg-white p-8">
        <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-gray-100" />
        <div className="mt-6 h-20 animate-pulse rounded bg-gray-100" />
        <div className="mt-8 h-12 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    </div>
  </section>
);

const ErrorState = ({ message }: { message: string }) => (
  <section className="min-h-screen bg-[#F8F8F8] px-4 py-8 sm:px-6 lg:px-16">
    <div className="mx-auto max-w-[1100px]">
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
        {message}
      </div>
    </div>
  </section>
);

const EmptyState = () => (
  <section className="min-h-screen bg-[#F8F8F8] px-4 py-8 sm:px-6 lg:px-16">
    <div className="mx-auto max-w-[1100px]">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
        Spoylz overview is unavailable.
      </div>
    </div>
  </section>
);

export default function SpoilOverview({ spoilId }: SpoilOverviewProps) {
  const router = useRouter();
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
  const preSpoilQuiz =
    spoil.quizzes?.find((quiz) => quiz.type?.toLowerCase() === "pre") ?? null;
  const ctaLabel = preSpoilQuiz ? "Take Pre-Spoil Quiz" : "Start Spoil";
  const ctaHref = preSpoilQuiz
    ? `/spoil/${spoil.id}/pre-spoil-quiz`
    : `/spoil/${spoil.id}/start`;
  const guidanceText = preSpoilQuiz
    ? "You have to take a Pre-Spoylz Quiz before starting this Spoylz. At the end of the Spoylz, you'll take a Post-Spoylz Quiz to test your knowledge and earn a certificate. Some modules may also have quizzes to reinforce learning."
    : "You can start this Spoylz immediately and work through the modules at your own pace. If this Spoylz includes a post-Spoylz quiz, you'll take it after completing the lessons.";

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(`/spoil-details/${spoil.id}`);
  };

  return (
    <section className="min-h-screen px-4 py-8 sm:px-6 lg:px-20">
      <div className="mx-auto">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0C4A5C]"
        >
          <Image src={ArrowLeftIcon} alt="Back" width={18} height={18} />
          Back
        </button>

        <div className="mx-auto mt-8 max-w-[640px] rounded-[20px] border border-[#E8E8E8] px-6 py-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-8">
          <h1 className="text-[18px] font-semibold text-[#212529]">
            Spoylz Overview
          </h1>

          <div className="mt-6 rounded-2xl bg-[#F7F7F7] p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-black">
              {spoil.title}
            </h2>

            <div className="mt-4 flex items-center gap-2 text-sm text-[#6B7280]">
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
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D1D5DB] text-[10px] font-semibold text-[#374151]">
                  {getTutorInitials(spoil)}
                </span>
              )}
              <span className="underline decoration-[#9CA3AF] underline-offset-2 text-gray">
                {tutorName}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-[#6B7280]">
                <Image src={ProfileIcon} alt="Enrolled users" width={16} height={16} />
                {spoil.enrolled_users ?? 0} Enrolled
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-[#6B7280]">
                <Image src={BookIcon} alt="Modules" width={16} height={16} />
                {spoil.modules_no ?? 0} Modules
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-[#6B7280]">
                <Image src={ClockIcon} alt="Lessons" width={16} height={16} />
                {spoil.lessons_no ?? 0} Lessons
              </span>
            </div>
          </div>

          <p className="mt-6 text-[15px] leading-8 text-[#5F6368]">
            {guidanceText}
          </p>

          <Button
            variant="darkBlue"
            className="mt-8 w-full py-3"
            onClick={() => router.push(ctaHref)}
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
