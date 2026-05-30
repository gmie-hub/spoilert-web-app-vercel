"use client";

import Image, { type StaticImageData } from "next/image";
import { FiPlay } from "react-icons/fi";

import PolygonIcon from "@spt/assets/icons/Polygon 1.svg";
import Button from "@spt/components/button";
import type { SpoilDetailsData } from "@spt/utils/spoils";

import {
  type SpoilLesson,
  getTutorInitials,
  getTutorName,
} from "./startSpoilUtils";

interface StartSpoilContentPanelProps {
  activeLesson: SpoilLesson | null;
  activeLessonIsCompleted: boolean;
  isCompletingLesson: boolean;
  completedLessonsCount: number;
  heroImage: string | StaticImageData;
  learningItems: string[];
  spoil: SpoilDetailsData;
  totalLessons: number;
  onCompleteLesson: () => void;
  onOpenLessonContent: () => void;
}

export const StartSpoilContentPanel = ({
  activeLesson,
  activeLessonIsCompleted,
  isCompletingLesson,
  completedLessonsCount,
  heroImage,
  learningItems,
  spoil,
  totalLessons,
  onCompleteLesson,
  onOpenLessonContent,
}: StartSpoilContentPanelProps) => {
  const tutorName = getTutorName(spoil);
  const spoilDescription = spoil?.description?.trim() || "";

  return (
    <div className="min-w-0">
      <div className="relative overflow-hidden rounded-[24px] bg-[#EDEDED]">
        <div className="relative aspect-[16/9] min-h-[240px] w-full">
          <Image
            src={heroImage}
            alt={activeLesson?.title || spoil?.title}
            fill
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-black/10" />

          <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#013B4D]">
            {activeLesson?.type ?? "lesson"}
          </div>

          <button
            type="button"
            onClick={onOpenLessonContent}
            disabled={!activeLesson?.content_url}
            className={`absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white text-[#013B4D] shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-transform ${
              activeLesson?.content_url ? "cursor-pointer hover:scale-105" : "cursor-default"
            }`}
            aria-label="Open lesson content"
          >
            <FiPlay size={30} className="translate-x-[2px]" />
          </button>
        </div>
      </div>

      <div className="mt-7">
        <div>
          <h1 className="text-[28px] font-semibold leading-tight text-[#212529]">
            {activeLesson?.title || spoil.current_lesson || spoil.title}
          </h1>

          <p className="mt-2 text-sm text-[#7C8792]">
            {completedLessonsCount}/{totalLessons} lessons completed
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-[16px] font-semibold text-[#212529]">Overview</h2>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-[8px] bg-[#F2F4F5] px-3 py-1.5 text-xs font-medium text-[#6B7280]">
              {spoil?.category?.name || "General"}
            </span>

            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              {spoil?.tutor?.avatar ? (
                <div className="relative h-7 w-7 overflow-hidden rounded-full bg-gray-200">
                  <Image
                    src={spoil?.tutor?.avatar}
                    alt={tutorName}
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D7DDE1] text-[11px] font-semibold text-[#4B5563]">
                  {getTutorInitials(spoil)}
                </span>
              )}

              <span className="underline decoration-[#B8C1C6] underline-offset-2">
                {tutorName}
              </span>
            </div>
          </div>

          <p className="mt-5 max-w-[820px] text-[15px] leading-8 text-[#6B7280]">
            {spoilDescription || "No lesson overview is available yet."}
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-[16px] font-semibold text-[#212529]">
            What you will learn
          </h3>

          {learningItems.length > 0 ? (
            <div className="mt-4 space-y-4">
              {learningItems.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-3">
                  <Image
                    src={PolygonIcon}
                    alt=""
                    width={14}
                    height={14}
                    className="mt-1 shrink-0"
                  />
                  <p className="text-[15px] leading-7 text-[#5F6368]">{item}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-[15px] leading-7 text-[#6B7280]">
              Learning outcomes have not been added for this Spoylz yet.
            </p>
          )}
        </div>

        <Button
          variant="darkBlue"
          className={`mt-10 w-full rounded-[14px] py-4 ${
            activeLessonIsCompleted ? "bg-[#0E6076] hover:bg-[#0E6076]" : ""
          }`}
          disabled={!activeLesson || activeLessonIsCompleted || isCompletingLesson}
          onClick={onCompleteLesson}
        >
          {activeLessonIsCompleted
            ? "Lesson Completed"
            : isCompletingLesson
              ? "Completing..."
              : "Complete Lesson"}
        </Button>
      </div>
    </div>
  );
};
