"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiChevronDown, FiChevronUp, FiLock } from "react-icons/fi";

import CalendarIcon from "@spt/assets/icons/calendar.svg";
import MenuIcon from "@spt/assets/icons/menu.svg";
import Button from "@spt/components/button";
import type { SpoilDetailsData } from "@spt/utils/spoils";

import PostSpoilQuizPanel from "./PostSpoilQuizPanel";
import { ModuleQuizStatusRow, PreSpoilQuizRow } from "./SpoilQuizRows";
import {
  type SpoilLesson,
  type SpoilModule,
  formatExpiryDate,
  getModuleUnlockBlocker,
  getSpoilQuizGate,
  isModuleComplete,
  isModuleUnlocked,
} from "./startSpoilUtils";

interface StartSpoilSidebarProps {
  activeLesson: SpoilLesson | null;
  activeModule: SpoilModule | null;
  canCompleteSpoil: boolean;
  isCompletingSpoil: boolean;
  modules: SpoilModule[];
  openModuleIds: Set<number>;
  spoil: SpoilDetailsData;
  onCompleteSpoil: () => void;
  onHide: () => void;
  onOpenLesson: (module: SpoilModule, lesson: SpoilLesson) => void;
  onSelectLesson: (module: SpoilModule, lesson: SpoilLesson) => void;
  onSelectModule: (module: SpoilModule) => void;
  onToggleModule: (moduleId: number) => void;
}

export const StartSpoilSidebar = ({
  activeLesson,
  activeModule,
  canCompleteSpoil,
  isCompletingSpoil,
  modules,
  openModuleIds,
  spoil,
  onCompleteSpoil,
  onHide,
  onOpenLesson,
  onSelectLesson,
  onSelectModule,
  onToggleModule,
}: StartSpoilSidebarProps) => {
  const router = useRouter();

  // Quiz gate drives module locking, the per-module quiz CTA and the pre/post
  // quiz status shown in this panel.
  const quizGate = getSpoilQuizGate(spoil);

  const preStatus = quizGate.preStatus;

  const canTakePostQuiz = (() => {
    // backend may provide overall percentage as numeric or string fields
    const pctNum = Number(
      spoil?.percentage_completed ?? spoil?.percentage_completed?.toString?.(),
    );
    const rawProgress =
      (spoil as any)?.progress_percentage ??
      (spoil as any)?.learner_spoil?.progress_percentage ??
      null;

    if (!Number.isNaN(pctNum) && pctNum >= 100) return true;
    if (rawProgress && String(rawProgress) === "100.00") return true;

    return false;
  })();

  const isSpoilCompleted = (() => {
    const pctNum = Number(
      spoil?.percentage_completed ?? spoil?.percentage_completed?.toString?.(),
    );
    const rawProgress =
      (spoil as any)?.progress_percentage ??
      (spoil as any)?.learner_spoil?.progress_percentage ??
      null;

    if (!Number.isNaN(pctNum) && pctNum >= 100) return true;
    if (rawProgress && String(rawProgress) === "100.00") return true;

    return false;
  })();

  const handleTakePostQuiz = () => {
    if (!canTakePostQuiz) return;
    router.push(`/spoil/${spoil.id}/post-spoil-quiz`);
  };

  const handleTakeModuleQuiz = (moduleId: number) => {
    router.push(`/spoil/${spoil.id}/module-quiz?moduleId=${moduleId}`);
  };

  return (
    <aside className="rounded-[24px] border border-[#E6E6E6] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#212529]">
          Spoylz Content
        </h2>

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

      {quizGate.preQuiz && (
        <PreSpoilQuizRow quiz={quizGate.preQuiz} status={preStatus} />
      )}

      <div className="mt-6 space-y-4">
        {modules.length > 0 ? (
          modules.map((module, index) => {
            const isOpen = openModuleIds.has(module.id);
            const isActive = module.id === activeModule?.id;
            const moduleCompleted = isModuleComplete(module);
            const moduleUnlocked = isModuleUnlocked(modules, index, quizGate);
            const unlockBlocker = getModuleUnlockBlocker(
              modules,
              index,
              quizGate,
            );
            const moduleQuiz = quizGate.getModuleQuiz(module.id);
            const moduleQuizStatus = quizGate.getModuleQuizStatus(module.id);
            const needsModuleQuiz =
              moduleCompleted && !!moduleQuiz && !moduleQuizStatus.isPassed;
            const lockedByPreviousQuiz = unlockBlocker?.reason === "quiz";

            return (
              <div
                key={module.id}
                className={`overflow-hidden rounded-[16px] border transition-colors ${
                  isActive
                    ? "border-[#CFE5EC] bg-[#F9FCFD]"
                    : "border-[#E9E9E9] bg-white"
                } ${moduleUnlocked ? "" : "opacity-70"}`}
              >
                <div className="flex items-start gap-3 px-4 py-4">
                  {moduleUnlocked ? (
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
                  ) : (
                    <span
                      className="mt-1 flex h-5 w-5 items-center justify-center rounded-[6px] border border-[#C8CDD2] bg-[#F2F4F5] text-[#7C8792]"
                      aria-label={`${module.title} locked`}
                    >
                      <FiLock size={12} />
                    </span>
                  )}

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

                  {moduleUnlocked && (
                    <button
                      type="button"
                      onClick={() => onToggleModule(module.id)}
                      className="mt-1 text-[#7C8792]"
                      aria-expanded={isOpen}
                      aria-label={
                        isOpen
                          ? "Collapse module lessons"
                          : "Expand module lessons"
                      }
                    >
                      {isOpen ? (
                        <FiChevronUp size={18} />
                      ) : (
                        <FiChevronDown size={18} />
                      )}
                    </button>
                  )}
                </div>

                {!moduleUnlocked && lockedByPreviousQuiz && (
                  <div className="border-t border-[#EEF1F3] bg-[#FFF7ED] px-4 py-3">
                    <p className="text-xs font-medium text-[#9A6A2B]">
                      Pass the previous module quiz to unlock this module.
                    </p>
                    <Button
                      variant="darkBlue"
                      onClick={() => {
                        if (unlockBlocker?.reason === "quiz") {
                          handleTakeModuleQuiz(unlockBlocker.module.id);
                        }
                      }}
                      className="mt-3 w-full rounded-[12px] py-2.5 text-sm"
                    >
                      Take Module Quiz
                    </Button>
                  </div>
                )}

                {!moduleUnlocked && !lockedByPreviousQuiz && (
                  <div className="border-t border-[#EEF1F3] bg-[#FCFCFC] px-4 py-3 text-xs text-[#7C8792]">
                    Complete the previous module to unlock this module.
                  </div>
                )}

                {moduleUnlocked && <ModuleQuizStatusRow status={moduleQuizStatus} />}

                {moduleUnlocked && needsModuleQuiz && (
                  <div className="border-t border-[#EEF1F3] bg-[#FFF7ED] px-4 py-3">
                    <p className="text-xs font-medium text-[#9A6A2B]">
                      You&apos;ve finished this module. Take its quiz to
                      continue to the next one.
                    </p>
                    <Button
                      variant="darkBlue"
                      onClick={() => handleTakeModuleQuiz(module.id)}
                      className="mt-3 w-full rounded-[12px] py-2.5 text-sm"
                    >
                      Take Module Quiz
                    </Button>
                  </div>
                )}

                {moduleUnlocked && isOpen && (
                  <div className="border-t border-[#EEF1F3] bg-[#FCFCFC] px-4 py-3">
                    {module.lessons?.length ? (
                      <div className="space-y-2">
                        {module.lessons.map((lesson) => {
                          const isLessonActive = lesson.id === activeLesson?.id;
                          const isLessonCompleted =
                            lesson.status === "completed";

                          return (
                            <div
                              key={lesson.id}
                              className={`flex w-full items-center justify-between rounded-[12px] px-3 py-3 text-left transition-colors ${
                                isLessonActive
                                  ? "bg-[#EAF6FA] text-[#013B4D]"
                                  : "bg-white text-[#4B5563] hover:bg-[#F6FAFB]"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => onSelectLesson(module, lesson)}
                                className="min-w-0 flex-1 text-left"
                              >
                                <span className="block truncate text-sm font-medium">
                                  {lesson.title}
                                </span>
                                <span className="mt-1 block text-xs uppercase tracking-[0.12em] text-[#8A949E]">
                                  {lesson.type}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => onOpenLesson(module, lesson)}
                                className="shrink-0 pl-3 text-xs font-semibold text-[#0C4A5C] hover:underline"
                              >
                                {isLessonCompleted ? "Done" : "Open"}
                              </button>
                            </div>
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
            No modules are available for this Spoylz yet.
          </div>
        )}
      </div>

      <PostSpoilQuizPanel
        canTakeQuiz={canTakePostQuiz}
        status={quizGate.postStatus}
        onTakeQuiz={handleTakePostQuiz}
      />

      {isSpoilCompleted ? (
        <button
          type="button"
          onClick={() => router.push("/my-learnings?tab=completed")}
          className="mt-6 w-full rounded-[14px] py-3 text-center bg-[#ECFDF5] text-[#065F46] font-semibold cursor-pointer"
        >
          Spoylz Completed
        </button>
      ) : canCompleteSpoil ? (
        // Only surface the CTA once every lesson is complete.
        <Button
          variant="darkBlue"
          disabled={isCompletingSpoil}
          className={`mt-6 w-full rounded-[14px] py-3 ${
            isCompletingSpoil
              ? "cursor-not-allowed bg-[#9CB4BC] hover:bg-[#9CB4BC]"
              : ""
          }`}
          onClick={() => {
            if (isCompletingSpoil) return;
            onCompleteSpoil();
          }}
          aria-disabled={isCompletingSpoil}
        >
          {isCompletingSpoil ? "Completing..." : "Complete Spoylz"}
        </Button>
      ) : null}
    </aside>
  );
};
