"use client";

import { type FC, useMemo } from "react";

import Image from "next/image";
import { FiPlus } from "react-icons/fi";

import AddCircleIcon from "@spt/assets/icons/add-circle.svg";
import EditIcon from "@spt/assets/icons/edit.svg";
import Button from "@spt/components/button";
import NoData from "@spt/components/noData";
import { useGetAllModulesQuery } from "@spt/hooks/apiRequests/useGetAllModuleQuery";
import { useGetLessonQuery } from "@spt/hooks/apiRequests/useGetLessonQuery";
import { useOutlineManager } from "@spt/hooks/useOutlineManager";

import LessonModal from "../components/LessonModal";
import ModuleCard from "../components/ModuleCard";
import ModuleModal from "../components/ModuleModal";
import QuizModal from "../components/QuizModal";

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
    openQuizModal,
    closeQuizModal,
    handleQuizSubmit,
  } = useOutlineManager(data, onChange);

  const { data: serverModulesRaw, isLoading: modulesLoading } = useGetAllModulesQuery();

  const spoilId = data.spoil_id ?? null;

  // Fetch lessons for each server module
  const mod0Id = serverModulesRaw?.[0]?.id ?? null;
  const mod1Id = serverModulesRaw?.[1]?.id ?? null;
  const mod2Id = serverModulesRaw?.[2]?.id ?? null;
  const mod3Id = serverModulesRaw?.[3]?.id ?? null;
  const mod4Id = serverModulesRaw?.[4]?.id ?? null;

  const { data: lessons0 } = useGetLessonQuery(mod0Id, spoilId);
  const { data: lessons1 } = useGetLessonQuery(mod1Id, spoilId);
  const { data: lessons2 } = useGetLessonQuery(mod2Id, spoilId);
  const { data: lessons3 } = useGetLessonQuery(mod3Id, spoilId);
  const { data: lessons4 } = useGetLessonQuery(mod4Id, spoilId);

  const lessonsMap = useMemo(() => {
    const map: Record<string, typeof lessons0> = {};
    if (mod0Id) map[String(mod0Id)] = lessons0;
    if (mod1Id) map[String(mod1Id)] = lessons1;
    if (mod2Id) map[String(mod2Id)] = lessons2;
    if (mod3Id) map[String(mod3Id)] = lessons3;
    if (mod4Id) map[String(mod4Id)] = lessons4;
    return map;
  }, [mod0Id, mod1Id, mod2Id, mod3Id, mod4Id, lessons0, lessons1, lessons2, lessons3, lessons4]);

  // map server modules to local Module shape, merging in fetched lessons
  const serverModules = useMemo(() => {
    if (!serverModulesRaw?.length) return [];
    return serverModulesRaw.map((m) => {
      const serverLessons = lessonsMap[String(m.id)] ?? [];
      return {
        id: String(m.id),
        title: m.title,
        description: m.description,
        lessons: serverLessons.map((l) => ({
          id: String(l.id),
          title: l.title,
          type: l.type,
          content: l.content ?? "",
          file: null as File | null,
          fileName: l.file ?? undefined,
          description: l.description ?? "",
        })),
      };
    });
  }, [serverModulesRaw, lessonsMap]);

  const modulesToRender = serverModules.length > 0 ? serverModules : data.modules;

  const hasModules = modulesToRender.length > 0;

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm md:max-w-2xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="mt-2 text-xl font-semibold text-black">
            Spoil Outline
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
          learner's progress before and after taking the spoil.
        </p>

        <div className="mt-5 grid gap-4 md:grid-rows-2">
          <Button
            type="button"
            variant="outline"
            className="justify-between"
            onClick={() => openQuizModal("pre")}
          >
            <Image
              src={data.preQuiz ? EditIcon : AddCircleIcon}
              alt="add-edit"
            />

            {data.preQuiz ? "Edit Pre-Spoil Quiz" : "Create Pre-Spoil Quiz"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="justify-between"
            onClick={() => openQuizModal("post")}
          >
            <Image
              src={data.postQuiz ? EditIcon : AddCircleIcon}
              alt="add-edit"
            />

            {data.postQuiz ? "Edit Post-Spoil Quiz" : "Create Post-Spoil Quiz"}
          </Button>
        </div>

        <div className="mt-4 grid gap-4 text-xs text-gray-500 md:grid-cols-2">
          {data.preQuiz && (
            <p>
              Saved pre-spoil quiz:{" "}
              <span className="font-medium text-gray-800">
                {data.preQuiz.title}
              </span>
            </p>
          )}
          {data.postQuiz && (
            <p>
              Saved post-spoil quiz:{" "}
              <span className="font-medium text-gray-800">
                {data.postQuiz.title}
              </span>
            </p>
          )}
        </div>
      </div>

      <p className="text-sm">
        Break down your spoil outline into modules and lessons
      </p>

      <div className="space-y-6">
        {modulesToRender.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <NoData
              heading="No Spoil Module Has Been Added Yet"
              description="Add modules and lessons to each module to create a proper outline."
            />
          </div>
        ) : (
          modulesToRender.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
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
        initialValues={moduleModalState.initialValues}
        onClose={closeModuleModal}
        onSubmit={handleModuleSubmit}
        spoilId={data.spoil_id ?? null}
      />

      <LessonModal
        open={lessonModalState.open}
        isEditing={lessonModalState.lessonId !== null}
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
