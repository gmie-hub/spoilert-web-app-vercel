"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import DeleteConfirmationModal from "@spt/components/deleteConfirmationModal";
import useDeleteLesson from "@spt/hooks/apiRequests/useDeleteLesson";
import LessonContentViewer from "@spt/screens/main/spoil/LessonContentViewer";
import {
  type SpoilLesson,
  type SpoilModule,
  getLessonTypeLabel,
  splitLearningOutcomes,
} from "@spt/screens/main/spoil/startSpoilUtils";
import { containsHtml, htmlToPlainText } from "@spt/utils/richText";
import type { SpoilDetailsData } from "@spt/utils/spoils";

import { NOT_AVAILABLE, getFullName } from "../../mappers";

import DeleteIconButton from "./DeleteIconButton";
import EditIconButton from "./EditIconButton";
import AddLessonModal from "./modals/AddLessonModal";
import EditLessonModal from "./modals/EditLessonModal";
import EditModuleModal from "./modals/EditModuleModal";

const HamburgerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h16" stroke="var(--color-blue)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ChevronToggleIcon = ({ expanded }: { expanded: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d={expanded ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}
      stroke="#212529"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlayCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9.3" stroke="var(--color-blue)" strokeWidth="1.5" />
    <path d="M10 8.5l6 3.5-6 3.5v-7Z" fill="var(--color-blue)" />
  </svg>
);

const DiamondBullet = () => (
  <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px] bg-[var(--color-yellow)]" />
);

const Avatar = () => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="#9CA3AF" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#9CA3AF" />
    </svg>
  </span>
);

const SpoylzOutlineTab = ({ spoil }: { spoil: SpoilDetailsData }) => {
  const queryClient = useQueryClient();
  const modules = spoil.modules ?? [];
  const [contentHidden, setContentHidden] = useState(false);
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<number>>(
    () => new Set(modules[0] ? [modules[0].id] : []),
  );
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(modules[0]?.lessons?.[0]?.id ?? null);
  const [editingModule, setEditingModule] = useState<SpoilModule | null>(null);
  const [editingLesson, setEditingLesson] = useState<SpoilLesson | null>(null);
  const [addingLessonModuleId, setAddingLessonModuleId] = useState<number | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<SpoilLesson | null>(null);
  const { deleteLessonHandler, isLoading: isDeletingLesson } = useDeleteLesson();

  // A simple Spoylz is a single lesson, so lessons can only be edited there,
  // not added or removed.
  const isSimple = spoil.type?.toLowerCase() === "simple";

  const handleDeleteLesson = async () => {
    if (!deletingLesson) return;

    try {
      await deleteLessonHandler(deletingLesson.id);
      queryClient.invalidateQueries({ queryKey: ["spoil-details"] });
      if (deletingLesson.id === selectedLessonId) setSelectedLessonId(null);
      setDeletingLesson(null);
    } catch {
      // deleteLessonHandler has already shown the error.
    }
  };

  // Looked up from the latest data so an edit shows as soon as the Spoylz refetches.
  const selectedLesson =
    modules.flatMap((module) => module.lessons ?? []).find((lesson) => lesson.id === selectedLessonId) ?? null;
  const lessonContent = selectedLesson?.content ?? "";
  const learnings = splitLearningOutcomes(spoil.what_to_learn);

  const toggleModule = (moduleId: number) => {
    setExpandedModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  if (modules.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-400 sm:p-8">
        No modules have been added to this Spoylz yet.
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-6 ${contentHidden ? "lg:grid-cols-[56px_1fr]" : "lg:grid-cols-[340px_1fr]"}`}>
      {contentHidden ? (
        <div className="h-fit rounded-2xl border border-gray-100 bg-white p-4">
          <button type="button" aria-label="Show course content" onClick={() => setContentHidden(false)}>
            <HamburgerIcon />
          </button>
        </div>
      ) : (
        <div className="h-fit rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-center justify-between px-1 pb-3">
            <h3 className="text-lg font-semibold text-[#212529]">Course Content</h3>
            <button
              type="button"
              onClick={() => setContentHidden(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-blue)]"
            >
              <HamburgerIcon />
              Hide
            </button>
          </div>

          <div className="space-y-3">
            {modules.map((module, index) => {
              const expanded = expandedModuleIds.has(module.id);
              const lessons = module.lessons ?? [];

              return (
                <div key={module.id} className="rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1 py-1 pl-4 pr-2">
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className="flex min-w-0 flex-1 items-center justify-between gap-3 py-2 text-left"
                    >
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">Module {index + 1}</p>
                        <p className="mt-0.5 font-semibold text-[#212529]">{module.title}</p>
                      </div>
                      <ChevronToggleIcon expanded={expanded} />
                    </button>
                    <EditIconButton label={`Edit module ${index + 1}`} onClick={() => setEditingModule(module)} />
                  </div>

                  {expanded && (
                    <div className="border-t border-gray-100">
                      {lessons.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-gray-400">No lessons in this module yet.</p>
                      ) : (
                        lessons.map((lesson) => {
                          const active = lesson.id === selectedLessonId;
                          return (
                            <div
                              key={lesson.id}
                              className={`flex items-center gap-1 pr-2 ${active ? "bg-[var(--color-blue-lightest)]" : ""}`}
                            >
                              <button
                                type="button"
                                onClick={() => setSelectedLessonId(lesson.id)}
                                className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left text-sm"
                              >
                                <PlayCircleIcon />
                                <span
                                  className={`flex-1 ${active ? "font-medium text-[var(--color-blue)]" : "text-[#212529]"}`}
                                >
                                  {lesson.title}
                                </span>
                              </button>
                              <EditIconButton label="Edit lesson" onClick={() => setEditingLesson(lesson)} />
                              {!isSimple && (
                                <DeleteIconButton label="Delete lesson" onClick={() => setDeletingLesson(lesson)} />
                              )}
                            </div>
                          );
                        })
                      )}

                      {!isSimple && (
                        <button
                          type="button"
                          onClick={() => setAddingLessonModuleId(module.id)}
                          className="m-3 inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-blue)] px-3 py-1.5 text-sm font-medium text-[var(--color-blue)] hover:bg-[var(--color-blue-lightest)]"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          Add Lesson
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
        {selectedLesson?.content_url && (
          <div className="relative mb-6 aspect-video min-h-[240px] w-full overflow-hidden rounded-xl bg-black">
            <LessonContentViewer lesson={selectedLesson} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold text-[#212529]">{selectedLesson?.title ?? "Select a lesson"}</h2>
          {selectedLesson && (
            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-[#212529]">
              {getLessonTypeLabel(selectedLesson)}
            </span>
          )}
        </div>

        {htmlToPlainText(lessonContent) &&
          (containsHtml(lessonContent) ? (
            <div
              className="mt-4 text-sm leading-relaxed text-gray-600 [&_a]:text-[var(--color-blue)] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: lessonContent }}
            />
          ) : (
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-600">{lessonContent}</p>
          ))}

        <p className="mt-6 text-sm text-gray-400">Overview</p>

        <span className="mt-2 inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-[#212529]">
          {spoil.category?.name || "General"}
        </span>

        <div className="mt-3 flex items-center gap-3">
          <Avatar />
          <span className="font-medium text-[var(--color-blue)] underline underline-offset-2">
            {getFullName(spoil.tutor)}
          </span>
        </div>

        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-500">
          {spoil.description || NOT_AVAILABLE}
        </p>

        <h3 className="mt-6 font-semibold text-[#212529]">What you will learn</h3>
        {learnings.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {learnings.map((point, index) => (
              <li key={`${point}-${index}`} className="flex items-start gap-3 text-sm text-gray-600">
                <DiamondBullet />
                {point}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-600">{NOT_AVAILABLE}</p>
        )}
      </div>

      {editingModule && <EditModuleModal module={editingModule} onClose={() => setEditingModule(null)} />}
      {editingLesson && <EditLessonModal lesson={editingLesson} onClose={() => setEditingLesson(null)} />}
      {addingLessonModuleId !== null && (
        <AddLessonModal moduleId={addingLessonModuleId} onClose={() => setAddingLessonModuleId(null)} />
      )}

      <DeleteConfirmationModal
        open={Boolean(deletingLesson)}
        itemName="This Lesson"
        isLoading={isDeletingLesson}
        onConfirm={handleDeleteLesson}
        onCancel={() => setDeletingLesson(null)}
      />
    </div>
  );
};

export default SpoylzOutlineTab;
