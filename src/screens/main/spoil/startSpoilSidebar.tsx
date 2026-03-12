"use client";

import Image from "next/image";
import { FiChevronDown, FiChevronUp, FiLock } from "react-icons/fi";

import CalendarIcon from "@spt/assets/icons/calendar.svg";
import MenuIcon from "@spt/assets/icons/menu.svg";
import Button from "@spt/components/button";
import type { SpoilDetailsData } from "@spt/utils/spoils";

import {
  type SpoilLesson,
  type SpoilModule,
  formatExpiryDate,
  isModuleComplete,
} from "./startSpoilUtils";

interface StartSpoilSidebarProps {
  activeLesson: SpoilLesson | null;
  activeModule: SpoilModule | null;
  canCompleteSpoil: boolean;
  completedLessonIds: Set<number>;
  modules: SpoilModule[];
  openModuleIds: Set<number>;
  spoil: SpoilDetailsData;
  onCompleteSpoil: () => void;
  onHide: () => void;
  onSelectLesson: (module: SpoilModule, lesson: SpoilLesson) => void;
  onSelectModule: (module: SpoilModule) => void;
  onToggleModule: (moduleId: number) => void;
}

export const StartSpoilSidebar = ({
  activeLesson,
  activeModule,
  canCompleteSpoil,
  completedLessonIds,
  modules,
  openModuleIds,
  spoil,
  onCompleteSpoil,
  onHide,
  onSelectLesson,
  onSelectModule,
  onToggleModule,
}: StartSpoilSidebarProps) => (
  <aside className="rounded-[24px] border border-[#E6E6E6] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">
    <div className="flex items-center justify-between">
      <h2 className="text-[18px] font-semibold text-[#212529]">Spoil Content</h2>

      <button
        type="button"
        onClick={onHide}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#0C4A5C]"
      >
        <Image src={MenuIcon} alt="" width={18} height={18} />
        Hide
      </button>
    </div>

    <p className="mt-6 flex items-center gap-2 text-[14px] text-[#F04438]">
      <Image src={CalendarIcon} alt="" width={16} height={16} />
      {formatExpiryDate(spoil.expires_at)}
    </p>

    <div className="mt-6 space-y-4">
      {modules.length > 0 ? (
        modules.map((module, index) => {
          const isOpen = openModuleIds.has(module.id);
          const isActive = module.id === activeModule?.id;
          const moduleCompleted = isModuleComplete(module, completedLessonIds);

          return (
            <div
              key={module.id}
              className={`overflow-hidden rounded-[16px] border transition-colors ${
                isActive
                  ? "border-[#CFE5EC] bg-[#F9FCFD]"
                  : "border-[#E9E9E9] bg-white"
              }`}
            >
              <div className="flex items-start gap-3 px-4 py-4">
                <button
                  type="button"
                  onClick={() => onSelectModule(module)}
                  className="mt-1 h-5 w-5 rounded-[6px] border border-[#C8CDD2] bg-white text-[11px] font-semibold text-[#013B4D]"
                  aria-label={
                    moduleCompleted
                      ? `${module.title} completed`
                      : `${module.title} not completed`
                  }
                >
                  {moduleCompleted ? "✓" : ""}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectModule(module)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-xs text-[#9CA3AF]">Module {index + 1}</p>
                  <p className="mt-1 truncate text-[15px] font-medium text-[#212529]">
                    {module.title}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleModule(module.id)}
                  className="mt-1 text-[#7C8792]"
                  aria-expanded={isOpen}
                  aria-label={
                    isOpen ? "Collapse module lessons" : "Expand module lessons"
                  }
                >
                  {isOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </button>
              </div>

              {isOpen && (
                <div className="border-t border-[#EEF1F3] bg-[#FCFCFC] px-4 py-3">
                  {module.lessons?.length ? (
                    <div className="space-y-2">
                      {module.lessons.map((lesson) => {
                        const isLessonActive = lesson.id === activeLesson?.id;
                        const isLessonCompleted = completedLessonIds.has(lesson.id);

                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => onSelectLesson(module, lesson)}
                            className={`flex w-full items-center justify-between rounded-[12px] px-3 py-3 text-left transition-colors ${
                              isLessonActive
                                ? "bg-[#EAF6FA] text-[#013B4D]"
                                : "bg-white text-[#4B5563] hover:bg-[#F6FAFB]"
                            }`}
                          >
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium">
                                {lesson.title}
                              </span>
                              <span className="mt-1 block text-xs uppercase tracking-[0.12em] text-[#8A949E]">
                                {lesson.type}
                              </span>
                            </span>

                            <span className="shrink-0 text-xs font-semibold text-[#0C4A5C]">
                              {isLessonCompleted ? "Done" : "Open"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-[#7C8792]">
                      No lessons have been added to this module yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="rounded-[16px] border border-dashed border-[#D9E1E5] px-4 py-5 text-sm text-[#7C8792]">
          No modules are available for this spoil yet.
        </div>
      )}
    </div>

    <div className="mt-5 rounded-[16px] border border-[#B7DCE8] bg-[#EAF7FB] px-4 py-4">
      <p className="flex items-start gap-3 text-sm leading-6 text-[#5A6A73]">
        <FiLock className="mt-1 shrink-0 text-[#7C93A0]" size={16} />
        <span>
          <span className="font-medium text-[#4B5C65]">Post Spoil Quiz</span> -
          {" "}You have to complete all modules to unlock your certificate
        </span>
      </p>

      <Button
        variant="darkBlue"
        disabled
        className="mt-4 w-full cursor-not-allowed rounded-[12px] bg-[#8FB0BA] py-3 text-white hover:bg-[#8FB0BA]"
      >
        Take Post-Spoil Quiz
      </Button>
    </div>

    <Button
      variant="darkBlue"
      disabled={!canCompleteSpoil}
      className={`mt-6 w-full rounded-[14px] py-3 ${
        canCompleteSpoil
          ? ""
          : "cursor-not-allowed bg-[#9CB4BC] hover:bg-[#9CB4BC]"
      }`}
      onClick={onCompleteSpoil}
    >
      Complete Spoil
    </Button>
  </aside>
);
