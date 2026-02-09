"use client";

import type { FC } from "react";

import { FiPlus } from "react-icons/fi";

import Button from "@spt/components/button";
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

  const disableNext = data.modules.length === 0;

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-blue)]">
            Step 2
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">Spoil Outline</h2>
          <p className="mt-1 text-sm text-gray-500">
            Create quizzes and break down your spoil into modules and lessons.
          </p>
        </div>

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
      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-[#FDFDFE] p-6">
        <p className="text-sm text-gray-600">
          Create pre-spoil and post-spoil quizzes so you can track your learner's progress before and after taking the spoil.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="justify-between"
            onClick={() => openQuizModal("pre")}
          >
            {data.preQuiz ? "Edit Pre-Spoil Quiz" : "Create Pre-Spoil Quiz"}
            <FiPlus />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="justify-between"
            onClick={() => openQuizModal("post")}
          >
            {data.postQuiz ? "Edit Post-Spoil Quiz" : "Create Post-Spoil Quiz"}
            <FiPlus />
          </Button>
        </div>
        <div className="mt-4 grid gap-4 text-xs text-gray-500 md:grid-cols-2">
          {data.preQuiz && (
            <p>
              Saved pre-spoil quiz: <span className="font-medium text-gray-800">{data.preQuiz.title}</span>
            </p>
          )}
          {data.postQuiz && (
            <p>
              Saved post-spoil quiz: <span className="font-medium text-gray-800">{data.postQuiz.title}</span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {data.modules.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
            <p className="text-lg font-semibold text-gray-800">
              No Spoil Module Has Been Added Yet
            </p>
            <p className="max-w-xl text-sm text-gray-500">
              Add modules and lessons to each module to create a proper outline.
            </p>
            <Button type="button" onClick={() => openModuleModal()}>
              Add Module
            </Button>
          </div>
        ) : (
          data.modules.map((module, index) => (
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
              onDeleteLesson={(lessonId) => handleDeleteLesson(module.id, lessonId)}
            />
          ))
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="button" disabled={disableNext} onClick={onNext}>
          Save and Continue
        </Button>
      </div>

      <ModuleModal
        open={moduleModalState.open}
        isEditing={moduleModalState.editingId !== null}
        initialValues={moduleModalState.initialValues}
        onClose={closeModuleModal}
        onSubmit={handleModuleSubmit}
      />

      <LessonModal
        open={lessonModalState.open}
        isEditing={lessonModalState.lessonId !== null}
        initialValues={lessonModalState.initialValues}
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
