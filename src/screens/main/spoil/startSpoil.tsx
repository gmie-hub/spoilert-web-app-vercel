"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import ArrowRightIcon from "@spt/assets/icons/arrow-right.svg";
import ChatIcon from "@spt/assets/icons/chat.svg";
import CommunityIcon from "@spt/assets/icons/community.svg";
import MenuIcon from "@spt/assets/icons/menu.svg";
import HeroImage from "@spt/assets/images/Hero.png";
import Button from "@spt/components/button";
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
  const { data: spoil, isLoading, isError, errorMessage } =
    useGetSpoilDetailsQuery(spoilId);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(
    new Set(),
  );
  const [openModuleIds, setOpenModuleIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!spoil) return;

    const initialSelection = getInitialSelection(spoil);
    setActiveModuleId(initialSelection.moduleId);
    setActiveLessonId(initialSelection.lessonId);
    setOpenModuleIds(
      initialSelection.moduleId ? new Set([initialSelection.moduleId]) : new Set(),
    );
    setCompletedLessonIds(new Set());
  }, [spoil]);

  const modules = spoil?.modules ?? [];
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
  const completedLessonsCount = completedLessonIds.size;

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
    return <MessageState message="This spoil could not be loaded." />;
  }

  const heroImage = spoil.cover_image_url || HeroImage;
  const activeLessonIsCompleted = activeLesson
    ? completedLessonIds.has(activeLesson.id)
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

  const handleCompleteLesson = () => {
    if (!activeLesson) {
      return;
    }

    setCompletedLessonIds((current) => {
      const next = new Set(current);
      next.add(activeLesson.id);
      return next;
    });
  };

  return (
    <section className="min-h-screen bg-[#FAFAFA] px-4 py-8 sm:px-6 lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <Breadcrumbs crumbLabel="Start Spoil" onBack={handleBack} spoilId={spoil.id} />

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-[14px] border-[#A9C2CB] px-5 py-3 text-[#013B4D] hover:bg-white"
              iconLeft={<Image src={ChatIcon} alt="" width={20} height={20} />}
              onClick={() => {
                if (spoil.tutor?.email) {
                  window.location.href = `mailto:${spoil.tutor.email}`;
                }
              }}
            >
              Chat Tutor
            </Button>

            <Button
              variant="darkBlue"
              className="gap-2 rounded-[14px] px-5 py-3"
              iconLeft={<Image src={CommunityIcon} alt="" width={18} height={18} />}
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
              completedLessonIds={completedLessonIds}
              modules={modules}
              openModuleIds={openModuleIds}
              spoil={spoil}
              onCompleteSpoil={() => router.push(`/spoil/${spoil.id}`)}
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
