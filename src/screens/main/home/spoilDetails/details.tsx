"use client";

import React, { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import PDFIcon from "@spt/assets/icons/pdf.svg";
import PlayIcon from "@spt/assets/icons/play.svg";
import PolyIcon from "@spt/assets/icons/Polygon 1.svg";
import QuizIcon from "@spt/assets/icons/question-chat-svgrepo-com 1.svg";
import RatingIcon from "@spt/assets/icons/star.svg";
import type { SpoilDetailsData } from "@spt/utils/spoils";

import Tabs from "../../../../components/tabs";

interface DetailsProps {
  spoil: SpoilDetailsData;
}

type OutlineItem = {
  id: string;
  title: string;
  type: "lesson" | "quiz";
  lessonType?: string | null;
};

const splitLearningOutcomes = (value?: string | null) => {
  if (!value) return [];

  const separator = value.includes("\n") ? /\r?\n/ : /,(?!\d)/;

  return value
    .split(separator)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
};

const formatDate = (value?: string | null) => {
  if (!value) return "No expiry date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getLessonIcon = (type?: string | null) => {
  switch (type?.toLowerCase()) {
    case "pdf":
      return PDFIcon;
    case "video":
      return PlayIcon;
    default:
      return PlayIcon;
  }
};

const buildModuleOutlineItems = (spoil: SpoilDetailsData, moduleId: number) => {
  const moduleData = spoil.modules?.find((item) => item.id === moduleId);
  const lessons: OutlineItem[] =
    moduleData?.lessons?.map((lesson) => ({
      id: `lesson-${lesson.id}`,
      title: lesson.title,
      type: "lesson",
      lessonType: lesson.type,
    })) ?? [];

  const moduleQuiz = spoil.quizzes?.find(
    (quiz) => Number(quiz.module_id) === moduleId,
  );

  if (moduleQuiz) {
    lessons.push({
      id: `quiz-${moduleQuiz.id}`,
      title: moduleQuiz.title || "Quiz",
      type: "quiz",
    });
  }

  return lessons;
};

export default function Details({ spoil }: DetailsProps) {
  const [expanded, setExpanded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [openModuleIds, setOpenModuleIds] = useState<Set<number>>(
    () => new Set(spoil.modules?.[0] ? [spoil.modules[0].id] : []),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setIsSmallScreen(window.innerWidth < 1024);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setOpenModuleIds(new Set(spoil.modules?.[0] ? [spoil.modules[0].id] : []));
  }, [spoil.id, spoil.modules]);

  const description =
    spoil.description?.trim() || "No description has been added for this spoil yet.";
  const learningItems = splitLearningOutcomes(spoil.what_to_learn);

  const modules = useMemo(() => spoil.modules ?? [], [spoil.modules]);

  const moduleOutline = useMemo(
    () =>
      modules.map((module) => ({
        ...module,
        items: buildModuleOutlineItems(spoil, module.id),
      })),
    [modules, spoil],
  );

  const toggleModule = (moduleId: number) => {
    setOpenModuleIds((current) => {
      const next = new Set(current);

      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);

      return next;
    });
  };

  const overviewContent = (
    <div className="w-full">
      <div className="text-gray-700 leading-7 mb-4 mt-4">
        <p
          className={`transition-all duration-300 ${
            expanded ? "max-h-full" : "max-h-[8rem] overflow-hidden"
          }`}
        >
          {description}
        </p>
        {description.length > 240 && (
          <button
            onClick={() => setExpanded((state) => !state)}
            className="mt-2 text-blue-600 text-sm font-medium flex items-center gap-2 hover:underline"
          >
            {expanded ? "Show less" : "Show more"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke="#0B5FFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <h4 className="text-base font-semibold mt-6 mb-4">What you will learn</h4>
      {learningItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
          {learningItems.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-start gap-3">
              <Image src={PolyIcon} alt="Learning outcome" width={20} height={20} />
              <p className="text-gray-700 text-sm">{item}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No learning outcomes have been added for this Spoylz yet.
        </p>
      )}
    </div>
  );

  const outlineContent = (
    <div className="space-y-4 pt-4">
      {moduleOutline.length > 0 ? (
        moduleOutline.map((module, index) => {
          const isOpen = openModuleIds.has(module.id);

          return (
            <div
              key={module.id}
              className="overflow-hidden rounded-2xl border border-[#E7E7E7] bg-white"
            >
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <div>
                  <p className="text-xs text-[#9CA3AF]">Module {index + 1}</p>
                  <h4 className="mt-1 text-[18px] font-medium text-[#1F2937]">
                    {module.title}
                  </h4>
                </div>

                <span className="text-[#6B7280]">
                  {isOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-[#E7E7E7] bg-[#FCFCFC]">
                  {module.items.length > 0 ? (
                    <ul>
                      {module.items.map((item, itemIndex) => (
                        <li
                          key={item.id}
                          className={`flex items-center gap-3 px-5 py-4 text-sm text-[#4B5563] ${
                            itemIndex > 0 ? "border-t border-[#E7E7E7]" : ""
                          }`}
                        >
                          <Image
                            src={
                              item.type === "quiz"
                                ? QuizIcon
                                : getLessonIcon(item.lessonType)
                            }
                            alt={item.type === "quiz" ? "Quiz" : "Lesson"}
                            width={16}
                            height={16}
                            className="shrink-0"
                          />
                          <span>{item.title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-5 py-4 text-sm text-gray-500">
                      No lessons have been added for this module yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="rounded-2xl border border-[#E7E7E7] bg-white p-5 text-sm text-gray-500">
          No modules have been added for this spoil yet.
        </div>
      )}

      {moduleOutline.length === 0 && (
        <div className="text-sm text-gray-500">
          <p>
            This spoil contains {spoil.modules_no ?? 0} modules and {spoil.lessons_no ?? 0} lessons.
          </p>
          <p className="mt-2">Expiry date: {formatDate(spoil.expires_at)}.</p>
        </div>
      )}
    </div>
  );

  const reviewsContent = (
    <div className="rounded-lg border border-[#F3F3F3] bg-white p-4 shadow-[0_4px_14px_rgba(13,38,59,0.04)]">
      <div className="flex items-center gap-2">
        <Image src={RatingIcon} alt="Average rating" width={20} height={20} />
        <p className="text-base font-semibold text-[#0F172A]">
          {(spoil.average_rating ?? 0).toFixed(1)} / 5
        </p>
      </div>
      <p className="mt-3 text-sm text-gray-700">
        {spoil.ratings_count ?? 0} rating{spoil.ratings_count === 1 ? "" : "s"} recorded so far.
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Detailed written reviews are not available from this endpoint yet.
      </p>
    </div>
  );

  const tabs = isSmallScreen
    ? [
        { label: "Overview", content: overviewContent },
        { label: "Spoylz Outline", content: outlineContent },
        { label: "Reviews", content: reviewsContent },
      ]
    : [
        { label: "Overview", content: overviewContent },
        { label: "Spoylz Outline", content: outlineContent },
      ];

  return (
    <section className="w-full mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <Tabs tabs={tabs} />
        </div>

        {!isSmallScreen && (
          <aside className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-sm border border-[#F1F1F1] p-4">
              <h5 className="font-semibold text-lg mb-3 text-black">Reviews</h5>
              {reviewsContent}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
