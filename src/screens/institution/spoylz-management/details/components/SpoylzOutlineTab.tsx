"use client";

import { useState } from "react";

import { MOCK_COURSE_OUTLINE, OUTLINE_LESSON_DETAIL, type OutlineLesson } from "./outlineConstants";

const HamburgerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h16" stroke="var(--color-blue)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ChevronToggleIcon = ({ expanded }: { expanded: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d={expanded ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}
      stroke="#212529"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 6l6 6-6 6" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlayCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9.3" stroke="var(--color-blue)" strokeWidth="1.5" />
    <path d="M10 8.5l6 3.5-6 3.5v-7Z" fill="var(--color-blue)" />
  </svg>
);

const QuizIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9.3" stroke="var(--color-yellow)" strokeWidth="1.5" />
    <path
      d="M9.7 9.6a2.3 2.3 0 1 1 3.4 2c-.7.4-1.1.8-1.1 1.6"
      stroke="var(--color-yellow)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="16.2" r="0.15" fill="var(--color-yellow)" stroke="var(--color-yellow)" strokeWidth="1.2" />
  </svg>
);

const DiamondBullet = () => (
  <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px] bg-[var(--color-yellow)]" />
);

const Avatar = () => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="#9CA3AF" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#9CA3AF" />
    </svg>
  </span>
);

const SpoylzOutlineTab = () => {
  const [contentHidden, setContentHidden] = useState(false);
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<string>>(new Set([MOCK_COURSE_OUTLINE[0].id]));
  const [selectedLesson, setSelectedLesson] = useState<OutlineLesson>(MOCK_COURSE_OUTLINE[0].lessons[0]);

  const toggleModule = (moduleId: string) => {
    setExpandedModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  return (
    <div className={`grid grid-cols-1 gap-6 ${contentHidden ? "lg:grid-cols-[56px_1fr]" : "lg:grid-cols-[340px_1fr]"}`}>
      {contentHidden ? (
        <div className="h-fit rounded-2xl border border-gray-100 bg-white p-4">
          <button type="button" aria-label="Show course content" onClick={() => setContentHidden(false)}>
            <HamburgerIcon />
          </button>
        </div>
      ) : (
        <div className="h-fit rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-center justify-between px-1 pb-3">
            <h3 className="text-lg font-semibold text-[#212529]">Course Content</h3>
            <button
              type="button"
              onClick={() => setContentHidden(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-blue)]"
            >
              <HamburgerIcon />
              Hide
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_COURSE_OUTLINE.map((module) => {
              const expanded = expandedModuleIds.has(module.id);
              return (
                <div key={module.id} className="rounded-xl border border-gray-100">
                  <button
                    type="button"
                    onClick={() => toggleModule(module.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <div>
                      <p className="text-xs text-gray-400">{module.moduleLabel}</p>
                      <p className="mt-0.5 font-semibold text-[#212529]">{module.title}</p>
                    </div>
                    <ChevronToggleIcon expanded={expanded} />
                  </button>

                  {expanded && (
                    <div className="border-t border-gray-100">
                      {module.lessons.map((lesson) => {
                        const active = lesson.id === selectedLesson.id;
                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => setSelectedLesson(lesson)}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm ${
                              active ? "bg-[var(--color-blue-lightest)]" : ""
                            }`}
                          >
                            {lesson.type === "quiz" ? <QuizIcon /> : <PlayCircleIcon />}
                            <span
                              className={`flex-1 ${active ? "font-medium text-[var(--color-blue)]" : "text-[#212529]"}`}
                            >
                              {lesson.title}
                            </span>
                            <ChevronRightIcon />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#1b2a4a] via-[#2d1b4a] to-[#4a1b3a]">
          <button
            type="button"
            aria-label="Play preview"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 7l9 5-9 5V7Z" fill="#212529" />
            </svg>
          </button>
        </div>

        <h2 className="mt-6 text-xl font-semibold text-[#212529]">{selectedLesson.title}</h2>
        <p className="mt-4 text-sm text-gray-400">Overview</p>

        <span className="mt-2 inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-[#212529]">
          {OUTLINE_LESSON_DETAIL.category}
        </span>

        <div className="mt-3 flex items-center gap-3">
          <Avatar />
          <span className="font-medium text-[var(--color-blue)] underline underline-offset-2">
            {OUTLINE_LESSON_DETAIL.lecturerName}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-gray-500">{OUTLINE_LESSON_DETAIL.description}</p>

        <h3 className="mt-6 font-semibold text-[#212529]">What you will learn</h3>
        <ul className="mt-3 space-y-3">
          {OUTLINE_LESSON_DETAIL.whatYouWillLearn.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-gray-600">
              <DiamondBullet />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SpoylzOutlineTab;
