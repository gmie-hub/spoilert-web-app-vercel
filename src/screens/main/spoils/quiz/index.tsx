"use client";

import { useEffect, useRef, useState } from "react";

import Stack from "@mui/material/Stack";
import {  useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import CustomStepper from "@spt/components/stepper";
import { useGetQuizDetailsQuery } from "@spt/hooks/apiRequests/useGetQuizDetailsQuery";
import useGetQuizQuestionsQuery from "@spt/hooks/apiRequests/useGetQuizQuestionsQuery";
import { updateQuizAndQuestions } from "@spt/screens/main/spoils/createSpoils/utils/quizHelpers";
import useCreateSpoilStore from "@spt/store/createSpoilStore";

import AddQuestions from "./steps/addQuestions";
import Overview from "./steps/overview";
import Review from "./steps/review";

import type { QuizOverviewDraft, QuizQuestion } from "./types";

const initialOverviewValues: QuizOverviewDraft = {
  title: "",
  description: "",
  numberOfQuestions: "",
  timeLimit: "",
  passmark: "",
};

const SpoilQuiz = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [overview, setOverview] =
    useState<QuizOverviewDraft>(initialOverviewValues);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const searchParams = useSearchParams();
  const quizType = (searchParams?.get("type") ?? "").toLowerCase();
  const moduleId = searchParams?.get("module_id") ?? null;
  const spoilId = searchParams?.get("spoilId") ?? null;
  const quizId = searchParams?.get("quiz_id") ?? null;

  // In edit mode (spoilId present) load the quiz's saved questions from the
  // server so they appear in the Add Questions step.
  const { questions: serverQuestions } = useGetQuizQuestionsQuery(
    spoilId && quizId ? quizId : null,
  );

  const hasLoadedServerQuestions = useRef(false);

  useEffect(() => {
    if (
      !hasLoadedServerQuestions.current &&
      serverQuestions.length > 0 &&
      questions.length === 0
    ) {
      setQuestions(serverQuestions);
      hasLoadedServerQuestions.current = true;
    }
  }, [serverQuestions, questions.length]);

  // In edit mode load the quiz overview (title, description, number of
  // questions, time limit, passmark) straight from the server so the Overview
  // fields always pre-fill — this doesn't rely on the local outline draft, which
  // can be stale.
  const isEditingServerQuiz = Boolean(spoilId && quizId);
  const { quizDetailsData } = useGetQuizDetailsQuery(
    isEditingServerQuiz ? Number(quizId) : 0,
    { enabled: isEditingServerQuiz },
  );

  const hasLoadedServerOverview = useRef(false);

  useEffect(() => {
    if (hasLoadedServerOverview.current || !quizDetailsData) return;

    const serverOverview: QuizOverviewDraft = {
      title: quizDetailsData.title ?? "",
      description: quizDetailsData.description ?? "",
      numberOfQuestions:
        quizDetailsData.no_of_questions != null
          ? String(quizDetailsData.no_of_questions)
          : "",
      timeLimit:
        quizDetailsData.time_limit != null
          ? String(quizDetailsData.time_limit)
          : "",
      passmark:
        quizDetailsData.pass_mark != null
          ? String(quizDetailsData.pass_mark)
          : "",
    };

    setOverview(serverOverview);

    // Keep the sessionStorage init key (read by the Overview step) in sync with
    // the freshly-fetched server values so the fields pre-fill even when the
    // local outline draft is missing or stale.
    try {
      if (typeof window !== "undefined") {
        const storageKey =
          quizType === "post"
            ? "postspoil-quiz-init"
            : quizType === "module"
              ? "modulespoil-quiz-init"
              : "prespoil-quiz-init";
        const existingRaw = sessionStorage.getItem(storageKey);
        const existing = existingRaw ? JSON.parse(existingRaw) : {};
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({
            ...existing,
            ...serverOverview,
            overview: { ...(existing.overview ?? {}), ...serverOverview },
          }),
        );
      }
    } catch {
      // ignore storage errors
    }

    hasLoadedServerOverview.current = true;
  }, [quizDetailsData, quizType]);

  const setOutline = useCreateSpoilStore((s) => s.setOutline);
  const setBasics = useCreateSpoilStore((s) => s.setBasics);

  const goToNextStep = () =>
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const goToPreviousStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));
  const goToStep = (stepIndex: number) => setActiveStep(stepIndex);

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Overview
            initialValues={overview}
            quizType={quizType}
            onSaveAndNext={(values) => {
              setOverview(values);
              goToNextStep();
            }}
          />
        );
      case 1:
        return (
          <AddQuestions
            questions={questions}
            onQuestionsChange={setQuestions}
            quizType={quizType}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 2:
        return (
          <Review
            overview={overview}
            questions={questions}
            onEditOverview={() => goToStep(0)}
            onEditQuestions={() => goToStep(1)}
            onPublish={async () => {
              // When the spoil already exists on the server (spoilId + quiz_id in
              // the URL), the quiz is edited directly via the edit endpoints.
              const isServerEdit = isEditingServerQuiz;

              // persist directly into the advanced-spoil-draft store so the
              // outline reflects the latest quiz immediately.
              try {
                const currentBasics = useCreateSpoilStore.getState().basics ?? {};
                const quizPayload: any = {
                  id: String(Date.now()),
                  overview: overview,
                  questions: questions,
                  title: overview.title,
                  description: overview.description,
                };

                // Every quiz type carries a pass mark. Include both the
                // camelCase and snake_case keys the payload builders read.
                quizPayload.overview = {
                  ...quizPayload.overview,
                  passmark: overview.passmark,
                  pass_mark: overview.passmark,
                };
                quizPayload.passmark = overview.passmark;
                quizPayload.pass_mark = overview.passmark;

                if (quizType === "pre" || quizType === "post") {
                  // save full quiz (overview + questions) inside basics
                  try {
                    setBasics({ ...(currentBasics as any), ...(quizType === "pre" ? { preQuiz: quizPayload } : { postQuiz: quizPayload }) } as any);
                  } catch {
                    // ignore store errors
                  }
                }

                if (quizType === "module") {
                  if (!moduleId) {
                    toast.error("Module id is missing; cannot save module quiz into draft");
                  } else {
                    const currentOutline = useCreateSpoilStore.getState().outline ?? { modules: [] };
                    const updatedModules = (currentOutline.modules || []).map((m: any) =>
                      String(m.id) === String(moduleId) ? { ...m, quiz: quizPayload } : m,
                    );
                    try {
                      setOutline({ ...(currentOutline as any), modules: updatedModules } as any);
                    } catch {
                      // ignore store errors
                    }
                  }
                }

                if (!isServerEdit) {
                  toast.success("Quiz saved to draft");
                }
              } catch {
                if (!isServerEdit) {
                  toast.error("Failed to save quiz draft");
                }
              }

              // Edit mode: push the quiz + each question to the server via the
              // edit endpoints (POST with `_method: patch` in the body). The
              // payload mirrors the create payload, so spoil_id/module_id are
              // forwarded too.
              if (isServerEdit) {
                try {
                  await updateQuizAndQuestions(quizId, overview, questions, {
                    type: quizType || "module",
                    spoilId: spoilId ?? undefined,
                    moduleId: moduleId ?? undefined,
                  });
                  toast.success("Quiz updated");
                } catch (err) {
                  toast.error("Failed to update quiz");
                  // rethrow so Review keeps the user on the page instead of
                  // navigating back after a failed update.
                  throw err;
                }
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stack
      mr={{ xs: 2, md: 20 }}
      ml={{ xs: 2, md: 10 }}
      my={{ xs: 2, md: 6 }}
      spacing={4}
    >
      <Stack spacing={1}>
        <h3 className="text-2xl font-semibold text-black">Create Quiz</h3>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 4, lg: 6 }}>
        <div className="w-full rounded-3xl bg-white p-6 shadow-sm lg:max-w-xs">
          <h4 className="text-xl font-semibold text-gray-900">Quiz Progress</h4>

          <div className="mt-6">
            <CustomStepper activeStep={activeStep} steps={steps} />
          </div>
        </div>

        <div className="flex-1">{renderStepContent()}</div>
      </Stack>
    </Stack>
  );
};

export default SpoilQuiz;

const steps = ["Overview", "Add Questions", "Review"];
