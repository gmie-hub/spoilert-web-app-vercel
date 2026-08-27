"use client";

import Image from "next/image";

import MenuIcon from "@spt/assets/icons/menu.svg";

import CongratulationsModal from "./CongratulationsModal";
import { StartSpoilContentPanel } from "./startSpoilContentPanel";
import { StartSpoilHeader } from "./StartSpoilHeader";
import { StartSpoilSidebar } from "./startSpoilSidebar";
import { LoadingState, MessageState } from "./startSpoilStates";
import { useStartSpoilScreen } from "./useStartSpoilScreen";

interface StartSpoilPageProps {
  spoilId: number | string;
}

export default function StartSpoilPage({ spoilId }: StartSpoilPageProps) {
  const {
    activeLesson,
    activeLessonIsCompleted,
    activeModule,
    canCompleteSpoil,
    closeCongrats,
    closeContent,
    completedLessonsCount,
    errorMessage,
    handleCompleteLesson,
    handleCompleteSpoil,
    handleOpenLesson,
    handleOpenLessonContent,
    handleSelectLesson,
    handleSelectModule,
    handleToggleModule,
    heroImage,
    isCompletingLesson,
    isCompletingSpoil,
    isCongratsOpen,
    isContentOpen,
    isError,
    isLoading,
    isSidebarVisible,
    learningItems,
    modules,
    openModuleIds,
    redirectMessage,
    setIsSidebarVisible,
    spoil,
    totalLessons,
  } = useStartSpoilScreen(spoilId);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <MessageState message={errorMessage} tone="error" />;
  }

  if (!spoil) {
    return <MessageState message="This Spoylz could not be loaded." />;
  }

  if (redirectMessage) {
    return <MessageState message={redirectMessage} />;
  }

  return (
    <section className="min-h-screen bg-[#FAFAFA] px-4 py-8 sm:px-6 lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        <StartSpoilHeader community={spoil.community} spoilId={spoil.id} />

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
              onOpenLesson={handleOpenLesson}
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
              isContentOpen={isContentOpen}
              learningItems={learningItems}
              spoil={spoil}
              totalLessons={totalLessons}
              onCloseContent={closeContent}
              onCompleteLesson={handleCompleteLesson}
              onOpenLessonContent={handleOpenLessonContent}
            />
          </div>
        </div>
      </div>

      <CongratulationsModal
        open={isCongratsOpen}
        onClose={closeCongrats}
        hasCertificate={Number(spoil?.has_certificate) === 1}
        spoilId={spoil.id}
      />
    </section>
  );
}
