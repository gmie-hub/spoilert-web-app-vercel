"use client";

import { type FC, useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";

import AddCircleIcon from "@spt/assets/icons/add-circle.svg";
import EditIcon from "@spt/assets/icons/edit.svg";
import Button from "@spt/components/button";
import NoData from "@spt/components/noData";
import { useOutlineManager } from "@spt/hooks/useOutlineManager";

import LessonModal from "../components/LessonModal";
import ModuleCard from "../components/ModuleCard";
import ModuleModal from "../components/ModuleModal";
import QuizModal from "../components/QuizModal";

import { extractServerQuizId } from "./spoilBasicsHelpers";

import type { OutlineData } from "../types";

interface SpoilOutlineStepProps {
  data: OutlineData;
  onChange: (value: OutlineData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SpoilOutlineStep: FC<SpoilOutlineStepProps> = ({
  data,
  onChange,
  onNext,
  onPrevious,
}) => {
  const router = useRouter();

  const [draftData, setDraftData] = useState<any | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = sessionStorage.getItem("advanced-spoil-draft");
        if (raw) {
          const parsed = JSON.parse(raw);
          setDraftData(parsed);
          // eslint-disable-next-line no-console
          console.log("advanced-spoil-draft:", parsed);
          // also log basics if available
          // eslint-disable-next-line no-console
          console.log("advanced-spoil-draft basics:", parsed.state?.basics ?? parsed.basics ?? null);
        } else {
          setDraftData(null);
          // eslint-disable-next-line no-console
          console.log("advanced-spoil-draft: not found");
        }
      }
    } catch (e) {
      setDraftData(null);
      // eslint-disable-next-line no-console
      console.log("advanced-spoil-draft: parse error", e);
    }
  }, []);


  const draftPreQuiz = draftData?.state?.basics?.preQuiz ?? null;
  const draftPostQuiz = draftData?.state?.basics?.postQuiz ?? null;
  const preQuizAvailable = Boolean(draftPreQuiz || data.preQuiz);
  const postQuizAvailable = Boolean(draftPostQuiz || data.postQuiz);

  const {
    moduleModalState,
    lessonModalState,
    quizModalState,
    collapsedModules,
    openModuleModal,
    closeModuleModal,
    handleModuleSubmit,
    handleDeleteModule,
    toggleModuleCollapse,
    openLessonModal,
    closeLessonModal,
    handleLessonSubmit,
    handleDeleteLesson,
    closeQuizModal,
    handleQuizSubmit,
  } = useOutlineManager(data, onChange);


  const modulesToRender = data.modules;
  const hasModules = modulesToRender.length > 0;

   

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm md:max-w-2xl space-y-6 md:sticky md:top-24 md:self-start md:h-[calc(100vh-6rem)] md:overflow-auto">
      <div className="sticky top-0 z-50 bg-white flex flex-nowrap items-center justify-between gap-4 w-full py-3">
        <div>
          <h2 className="mt-2 text-xl font-semibold text-black">
            Spoylz Outline
          </h2>
        </div>

        {hasModules && (
          <Button
            type="button"
            variant="darkBlue"
            className="min-w-[180px]"
            onClick={() => openModuleModal()}
          >
            <span className="flex items-center gap-2">
              <FiPlus />
              Add Module
            </span>
          </Button>
        )}
      </div>

      <div className="rounded-2xl border border-gray-100 p-6">
        <p className="text-sm text-gray-600">
          Create pre-spoil and post-spoil quizzes so you can track your
          learner&apos;s progress before and after taking the Spoylz.
        </p>

        <div className="mt-5 grid gap-4 md:grid-rows-2">
          <Button
            type="button"
            variant="outline"
            className="justify-between"
            onClick={() => {
              // Prefer the local draft (has in-progress edits + questions);
              // otherwise fall back to the server quiz mapped into the outline so
              // its overview fields pre-fill when editing an existing spoil.
              const preInit = draftPreQuiz ?? data.preQuiz ?? null;
              try {
                if (preInit) {
                  sessionStorage.setItem("prespoil-quiz-init", JSON.stringify(preInit));
                } else {
                  sessionStorage.removeItem("prespoil-quiz-init");
                }
              } catch {
                // ignore
              }

              const params = new URLSearchParams({ type: "pre" });
              if (data.spoil_id) params.set("spoilId", String(data.spoil_id));
              const preQuizId = extractServerQuizId(
                data.preQuiz?.id ?? draftPreQuiz?.id,
              );
              if (preQuizId) params.set("quiz_id", preQuizId);

              router.push(`/spoils/create-quiz?${params.toString()}`);
            }}
          >
            <Image src={preQuizAvailable ? EditIcon : AddCircleIcon} alt="add-edit" />

            {preQuizAvailable ? "Edit Pre-Spoylz Quiz" : "Create Pre-Spoylz Quiz"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="justify-between"
            onClick={() => {
              // Prefer the local draft (has in-progress edits + questions);
              // otherwise fall back to the server quiz mapped into the outline so
              // its overview fields pre-fill when editing an existing spoil.
              const postInit = draftPostQuiz ?? data.postQuiz ?? null;
              try {
                if (postInit) {
                  sessionStorage.setItem("postspoil-quiz-init", JSON.stringify(postInit));
                } else {
                  sessionStorage.removeItem("postspoil-quiz-init");
                }
              } catch {
                // ignore
              }

              const params = new URLSearchParams({ type: "post" });
              if (data.spoil_id) params.set("spoilId", String(data.spoil_id));
              const postQuizId = extractServerQuizId(
                data.postQuiz?.id ?? draftPostQuiz?.id,
              );
              if (postQuizId) params.set("quiz_id", postQuizId);

              router.push(`/spoils/create-quiz?${params.toString()}`);
            }}
          >
            <Image src={postQuizAvailable ? EditIcon : AddCircleIcon} alt="add-edit" />

            {postQuizAvailable ? "Edit Post-Spoylz Quiz" : "Create Post-Spoylz Quiz"}
          </Button>
        </div>

       
      </div>

      <p className="text-sm">
        Break down your Spoylz outline into modules and lessons
      </p>

      <div className="space-y-6">
        {modulesToRender.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <NoData
              heading="No Spoylz Module Has Been Added Yet"
              description="Add modules and lessons to each module to create a proper outline."
            />
          </div>
        ) : (
          modulesToRender.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              spoilId={data.spoil_id ?? null}
              moduleIndex={index}
              isCollapsed={collapsedModules[module.id] || false}
              onToggleCollapse={() => toggleModuleCollapse(module.id)}
              onEdit={() => openModuleModal(module)}
              onDelete={() => handleDeleteModule(module.id)}
              onAddLesson={() => openLessonModal(module.id)}
              onEditLesson={(lessonId) => {
                const lesson = module.lessons.find((l) => l.id === lessonId);
                if (lesson) openLessonModal(module.id, lesson);
              }}
              onDeleteLesson={(lessonId) =>
                handleDeleteLesson(module.id, lessonId)
              }
            />
          ))
        )}
      </div>

      <div className="mt-5 flex flex-col gap-6">
        <Button
          type="button"
          onClick={hasModules ? onNext : () => openModuleModal()}
        >
          {hasModules ? "Save and Continue" : "Add Module"}
        </Button>

        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
      </div>

      <ModuleModal
        open={moduleModalState.open}
        isEditing={moduleModalState.editingId !== null}
        editingId={moduleModalState.editingId}
        initialValues={moduleModalState.initialValues}
        onClose={closeModuleModal}
        onSubmit={handleModuleSubmit}
        spoilId={data.spoil_id ?? null}
      />

      <LessonModal
        open={lessonModalState.open}
        isEditing={lessonModalState.lessonId !== null}
        editingId={lessonModalState.lessonId}
        initialValues={lessonModalState.initialValues}
        moduleId={lessonModalState.moduleId}
        onClose={closeLessonModal}
        onSubmit={handleLessonSubmit}
      />

      <QuizModal
        open={quizModalState.open}
        variant={quizModalState.variant}
        initialValues={quizModalState.initialValues}
        onClose={closeQuizModal}
        onSubmit={handleQuizSubmit}
      />
    </div>
  );
};

export default SpoilOutlineStep;
