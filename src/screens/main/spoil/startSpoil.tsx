"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import ArrowRightIcon from "@spt/assets/icons/arrow-right.svg";
import ChatIcon from "@spt/assets/icons/chat.svg";
import HeroImage from "@spt/assets/icons/heroimage3.svg";
import MenuIcon from "@spt/assets/icons/menu.svg";
import Button from "@spt/components/button";
import useCompleteLessonMutation from "@spt/hooks/apiRequests/useCompleteLessonMutation";
import useCompleteSpoilMutation from "@spt/hooks/apiRequests/useCompleteSpoilMutation";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";

import { Breadcrumbs } from "./preSpoilQuiz/components/Breadcrumbs";
import { StartSpoilContentPanel } from "./startSpoilContentPanel";
import { StartSpoilSidebar } from "./startSpoilSidebar";
import { LoadingState, MessageState } from "./startSpoilStates";
import { getInitialSelection, splitLearningOutcomes } from "./startSpoilUtils";

import type { SpoilLesson, SpoilModule } from "./startSpoilUtils";

interface StartSpoilPageProps {
  spoilId: number | string;
}

export default function StartSpoilPage({ spoilId }: StartSpoilPageProps) {
  const router = useRouter();
  const { completeLessonHandler, isCompletingLesson } = useCompleteLessonMutation();
  const { completeSpoilHandler, isCompletingSpoil } = useCompleteSpoilMutation();
  const { data: spoil, isLoading, isError, errorMessage } =
    useGetSpoilDetailsQuery(spoilId);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [openModuleIds, setOpenModuleIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!spoil) return;

    const initialSelection = getInitialSelection(spoil);
    setActiveModuleId(initialSelection.moduleId);
    setActiveLessonId(initialSelection.lessonId);
    setOpenModuleIds(
      initialSelection.moduleId ? new Set([initialSelection.moduleId]) : new Set(),
    );
  }, [spoil]);

  const modules = useMemo(() => spoil?.modules ?? [], [spoil?.modules]);
  const learningItems = useMemo(
    () => splitLearningOutcomes(spoil?.what_to_learn),
    [spoil?.what_to_learn],
  );
  const totalLessons = useMemo(
    () =>
      modules.reduce(
        (count, module) => count + (module.lessons?.length ?? 0),
        0,
      ),
    [modules],
  );
  const completedLessonsCount = useMemo(
    () =>
      modules.reduce(
        (count, module) =>
          count +
          (module.lessons?.filter((lesson) => lesson.status === "completed")
            .length ?? 0),
        0,
      ),
    [modules],
  );

  const activeModule = useMemo(
    () => modules.find((module) => module.id === activeModuleId) ?? modules[0] ?? null,
    [activeModuleId, modules],
  );
  const activeLesson = useMemo(() => {
    if (!activeModule) return null;

    return (
      activeModule.lessons?.find((lesson) => lesson.id === activeLessonId) ??
      activeModule.lessons?.[0] ??
      null
    );
  }, [activeLessonId, activeModule]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <MessageState message={errorMessage} tone="error" />;
  }

  if (!spoil) {
    return <MessageState message="This Spoylz could not be loaded." />;
  }

  const heroImage = spoil.cover_image_url || HeroImage;
  const activeLessonIsCompleted = activeLesson
    ? activeLesson.status === "completed"
    : false;
  const canCompleteSpoil = totalLessons > 0 && completedLessonsCount >= totalLessons;

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(`/spoil/${spoil.id}`);
  };

  const handleToggleModule = (moduleId: number) => {
    setOpenModuleIds((current) => {
      const next = new Set(current);

      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }

      return next;
    });
  };

  const handleSelectModule = (module: SpoilModule) => {
    setActiveModuleId(module.id);
    setActiveLessonId(module.lessons?.[0]?.id ?? null);
    setOpenModuleIds((current) => new Set([...current, module.id]));
  };

  const handleSelectLesson = (module: SpoilModule, lesson: SpoilLesson) => {
    setActiveModuleId(module.id);
    setActiveLessonId(lesson.id);
  };

  const handleOpenLessonContent = () => {
    if (!activeLesson?.content_url) {
      return;
    }

    window.open(activeLesson.content_url, "_blank", "noopener,noreferrer");
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson) {
      return;
    }

    if (isCompletingLesson) {
      return;
    }

    const response = await completeLessonHandler(activeLesson.id);

    if (!response) {
      return;
    }
  };

  const handleCompleteSpoil = async () => {
    if (isCompletingSpoil) {
      return;
    }

    const response = await completeSpoilHandler(spoil.id);

    if (response) {
      // After successfully completing a spoil, take the learner to My Learnings
      // and show the completed tab so they can access their certificate.
      router.push(`/my-learnings?tab=completed`);
    }
  };

  return (
    <section className="min-h-screen bg-[#FAFAFA] px-4 py-8 sm:px-6 lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <Breadcrumbs crumbLabel="Start Spoil" onBack={handleBack} spoilId={spoil.id} />

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-[14px] border-[#A9C2CB] px-5 py-3 text-[#013B4D]"
              iconLeft={<Image src={ChatIcon} alt="" width={20} height={20} />}
              onClick={() => router.push(`/spoil/${spoil.id}/chat-tutor`)}
            >
              Chat Tutor
            </Button>

            <Button
              variant="darkBlue"
              className="gap-2 rounded-[14px] px-5 py-3"
              iconRight={<Image src={ArrowRightIcon} alt="" width={16} height={16} />}
            >
              Join Community
            </Button>
          </div>
        </div>

        <div
          className={`mt-8 grid items-start gap-6 ${
            isSidebarVisible ? "lg:grid-cols-[295px_minmax(0,1fr)]" : "grid-cols-1"
          }`}
        >
          {isSidebarVisible && (
            <StartSpoilSidebar
              activeLesson={activeLesson}
              activeModule={activeModule}
              canCompleteSpoil={canCompleteSpoil}
              isCompletingSpoil={isCompletingSpoil}
              modules={modules}
              openModuleIds={openModuleIds}
              spoil={spoil}
              onCompleteSpoil={handleCompleteSpoil}
              onHide={() => setIsSidebarVisible(false)}
              onSelectLesson={handleSelectLesson}
              onSelectModule={handleSelectModule}
              onToggleModule={handleToggleModule}
            />
          )}

          <div className="min-w-0">
            {!isSidebarVisible && (
              <button
                type="button"
                onClick={() => setIsSidebarVisible(true)}
                className="mb-5 inline-flex items-center gap-2 rounded-[14px] border border-[#D6E3E8] bg-white px-4 py-3 text-sm font-medium text-[#0C4A5C]"
              >
                <Image src={MenuIcon} alt="" width={18} height={18} />
                Show Spoil Content
              </button>
            )}

            <StartSpoilContentPanel
              activeLesson={activeLesson}
              activeLessonIsCompleted={activeLessonIsCompleted}
              isCompletingLesson={isCompletingLesson}
              completedLessonsCount={completedLessonsCount}
              heroImage={heroImage}
              learningItems={learningItems}
              spoil={spoil}
              totalLessons={totalLessons}
              onCompleteLesson={handleCompleteLesson}
              onOpenLessonContent={handleOpenLessonContent}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
