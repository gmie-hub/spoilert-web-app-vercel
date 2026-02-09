"use client";

import type { FC } from "react";

import {
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import Button from "@spt/components/button";

import type { Module } from "../types";

interface ModuleCardProps {
  module: Module;
  moduleIndex: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddLesson: () => void;
  onEditLesson: (lessonId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
}

const ModuleCard: FC<ModuleCardProps> = ({
  module,
  moduleIndex,
  isCollapsed,
  onToggleCollapse,
  onEdit,
  onDelete,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-[#FCFCFF] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-blue)]">
            Module {moduleIndex + 1}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-gray-900">
            {module.title}
          </h3>
          {module.description && (
            <p className="mt-1 text-sm text-gray-500">{module.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3 text-gray-500">
          <button
            type="button"
            className="rounded-full border border-gray-200 p-2 hover:text-gray-900"
            onClick={onToggleCollapse}
            aria-label="Toggle module visibility"
          >
            {isCollapsed ? <FiChevronDown /> : <FiChevronUp />}
          </button>
          <button
            type="button"
            className="rounded-full border border-gray-200 p-2 hover:text-gray-900"
            onClick={onEdit}
            aria-label="Edit module"
          >
            <FiEdit2 />
          </button>
          <button
            type="button"
            className="rounded-full border border-gray-200 p-2 hover:text-red-600"
            onClick={onDelete}
            aria-label="Delete module"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-6 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="lightBlue" onClick={onAddLesson}>
              + Add Lesson
            </Button>
            <Button type="button" variant="outline">
              Create Quiz
            </Button>
          </div>

          {module.lessons.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-4 text-sm text-gray-500">
              No lessons yet. Use "Add Lesson" to get started.
            </p>
          ) : (
            <ul className="space-y-3">
              {module.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3"
                >
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {lesson.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lesson.type === "text"
                        ? "Text Lesson"
                        : lesson.type === "video"
                        ? "Video Upload"
                        : "PDF Upload"}
                      {lesson.fileName && ` • ${lesson.fileName}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <button
                      type="button"
                      className="rounded-full border border-gray-200 p-2 hover:text-gray-900"
                      onClick={() => onEditLesson(lesson.id)}
                      aria-label="Edit lesson"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-gray-200 p-2 hover:text-red-600"
                      onClick={() => onDeleteLesson(lesson.id)}
                      aria-label="Delete lesson"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
