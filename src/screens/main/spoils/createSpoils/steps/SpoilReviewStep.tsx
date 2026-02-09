"use client";

import type { FC } from "react";

import Button from "@spt/components/button";

import type { BasicsFormData, OutlineData, SpoilTypeOption } from "../types";

interface SpoilReviewStepProps {
  basics: BasicsFormData;
  outline: OutlineData;
  selectedType: SpoilTypeOption;
  onPrevious: () => void;
  onSubmit: () => void;
}

const formatValue = (value: string) => (value ? value : "Not provided yet");

const SpoilReviewStep: FC<SpoilReviewStepProps> = ({
  basics,
  outline,
  selectedType,
  onPrevious,
  onSubmit,
}) => {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-blue)]">
        Final Step
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-gray-900">
        Spoil Review
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Review the information below before submitting your spoil for review.
      </p>

      <div className="mt-8 space-y-6">
        <section className="rounded-2xl border border-gray-100 p-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-blue)]">
              Spoil Basics
            </span>
            <h3 className="text-xl font-semibold text-gray-900">
              {basics.title || "Untitled Spoil"}
            </h3>
            <p className="text-sm text-gray-500">
              {selectedType === "advanced" ? "Advanced Spoil" : "Simple Spoil"}
            </p>
          </div>

          <dl className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">
                Category
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {formatValue(basics.category)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">
                Institution
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {formatValue(basics.institution)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">
                Pricing
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {basics.pricing || "Not set"}
                {basics.amount && (
                  <span className="ml-2 text-gray-500">
                    ({Number(basics.amount).toLocaleString()} NGN)
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">
                Expiry Date
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {formatValue(basics.expiryDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">
                Modules
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {formatValue(basics.moduleCount)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">
                Lessons
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {formatValue(basics.lessonCount)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">
                Cover Image
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {basics.coverImage ? basics.coverImage.name : "Not uploaded"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500">
                Course Code
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {formatValue(basics.courseCode)}
              </dd>
            </div>
          </dl>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                Description
              </h4>
              <p className="mt-2 text-sm text-gray-600">
                {basics.description || "No description added yet."}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                What Will They Learn
              </h4>
              <p className="mt-2 text-sm text-gray-600">
                {basics.learningOutcome || "No learning outcome added yet."}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 p-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-blue)]">
              Spoil Outline
            </span>
            <h3 className="text-xl font-semibold text-gray-900">
              {outline.modules.length} Module
              {outline.modules.length === 1 ? "" : "s"}
            </h3>
            <p className="text-sm text-gray-500">
              {outline.modules.length === 0
                ? "No modules added yet."
                : "Review the modules and lessons below."}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {outline.modules.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                Add at least one module to complete your spoil outline.
              </div>
            ) : (
              outline.modules.map((module, index) => (
                <div
                  key={module.id}
                  className="rounded-2xl border border-gray-100 bg-white px-5 py-4"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Module {index + 1}
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {module.title}
                    </h4>
                    {module.description && (
                      <p className="text-sm text-gray-500">
                        {module.description}
                      </p>
                    )}
                  </div>
                  <ul className="mt-4 space-y-2">
                    {module.lessons.length === 0 ? (
                      <li className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-500">
                        No lessons added to this module.
                      </li>
                    ) : (
                      module.lessons.map((lesson) => (
                        <li
                          key={lesson.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {lesson.type === "text"
                                ? "Text Lesson"
                                : lesson.type === "video"
                                  ? "Video Upload"
                                  : "Pdf Upload"}
                              {lesson.fileName && ` • ${lesson.fileName}`}
                            </p>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Pre-Spoil Quiz
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {outline.preQuiz?.title || "Not created"}
              </p>
              <p className="text-xs text-gray-500">
                {outline.preQuiz?.description ||
                  "Set up a pre-spoil quiz to gauge entry knowledge."}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Post-Spoil Quiz
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {outline.postQuiz?.title || "Not created"}
              </p>
              <p className="text-xs text-gray-500">
                {outline.postQuiz?.description ||
                  "Add a post-spoil quiz to measure improvement."}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="button" variant="darkBlue" onClick={onSubmit}>
          Submit Spoil
        </Button>
      </div>
    </div>
  );
};

export default SpoilReviewStep;
