"use client";

import type { FC } from "react";
import { useState } from "react";

import Image from "next/image";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import AddIcon from "@spt/assets/icons/add.svg";
import EditIcon from "@spt/assets/icons/gray-edit.svg";
import PDFIcon from "@spt/assets/icons/pdf.svg";
import PlayIcon from "@spt/assets/icons/play.svg";
import TrashIcon from "@spt/assets/icons/trash.svg";
import Button from "@spt/components/button";
import DeleteConfirmationModal from "@spt/components/deleteConfirmationModal";
import useDeleteLesson from "@spt/hooks/apiRequests/useDeleteLesson";

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
  const [deleteModuleOpen, setDeleteModuleOpen] = useState(false);
  const [deleteLessonId, setDeleteLessonId] = useState<string | null>(null);

  const handleDeleteModule = () => {
    // remove module locally from the draft/outline via parent handler
    setDeleteModuleOpen(false);
    onDelete();
  };

  const { deleteLessonHandler, isLoading: isDeletingLesson } = useDeleteLesson();

  const handleDeleteLesson = async () => {
    if (!deleteLessonId) return;
    try {
      await deleteLessonHandler(Number(deleteLessonId));
      setDeleteLessonId(null);
      onDeleteLesson(deleteLessonId);
    } catch {
      // toast shown by hook; keep modal open for retry
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm tracking-wider text-gray-500">
              Module {moduleIndex + 1}
            </p>

            <div className="flex items-center text-gray-500">
              <button
                type="button"
                className="p-2 hover:text-gray-900 cursor-pointer"
                onClick={onEdit}
                aria-label="Edit module"
              >
                <Image src={EditIcon} alt="edit" width={20} height={20} />
              </button>

              <button
                type="button"
                className="p-2 hover:text-red-600 cursor-pointer"
                onClick={() => setDeleteModuleOpen(true)}
                aria-label="Delete module"
              >
                <Image src={TrashIcon} alt="delete" width={20} height={20} />
              </button>

              <button
                type="button"
                className="p-2 hover:text-gray-900 cursor-pointer"
                onClick={onToggleCollapse}
                aria-label="Toggle module visibility"
              >
                {isCollapsed ? <FiChevronDown /> : <FiChevronUp />}
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-black">{module.title}</h3>

            {module.description && (
              <p className="mt-1 text-sm text-gray-500">{module.description}</p>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div className="mt-4 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" variant="outline" onClick={onAddLesson}>
                <Image src={AddIcon} alt="add" width={20} height={20} />
                Add Lesson
              </Button>

              <Button type="button" variant="outline">
                <Image src={AddIcon} alt="add" width={20} height={20} />
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
                  <div key={lesson.id}>
                    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div className="flex gap-2">
                        <Image
                          src={lesson.type === "video" ? PlayIcon : PDFIcon}
                          alt="play"
                          width={20}
                          height={20}
                        />

                        <p className="text-sm">{lesson.title}</p>
                      </div>

                      <div className="flex items-center gap-4 text-gray-500">
                        <button
                          type="button"
                          className="hover:text-red-600"
                          onClick={() => setDeleteLessonId(lesson.id)}
                          aria-label="Delete lesson"
                        >
                          <Image
                            src={TrashIcon}
                            alt="delete"
                            width={20}
                            height={20}
                          />
                        </button>

                        <button
                          type="button"
                          className="hover:text-gray-900"
                          onClick={() => onEditLesson(lesson.id)}
                          aria-label="Edit lesson"
                        >
                          <Image
                            src={EditIcon}
                            alt="edit"
                            width={20}
                            height={20}
                          />
                        </button>
                      </div>
                    </li>

                    <hr className="border-gray-200" />
                  </div>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        open={deleteModuleOpen}
        title={`Are You Sure You Want To Delete This Module?`}
        description="You won't be able to recover it once it is deleted"
        isLoading={false}
        onConfirm={handleDeleteModule}
        onCancel={() => setDeleteModuleOpen(false)}
      />

      <DeleteConfirmationModal
        open={deleteLessonId !== null}
        title={`Are You Sure You Want To Delete This Lesson?`}
        description="You won't be able to recover it once it is deleted"
        isLoading={isDeletingLesson}
        onConfirm={handleDeleteLesson}
        onCancel={() => setDeleteLessonId(null)}
      />
    </>
  );
};

export default ModuleCard;