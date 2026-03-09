"use client";

import { useState } from "react";

import Stack from "@mui/material/Stack";
import {  useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import CustomStepper from "@spt/components/stepper";
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
};

const SpoilQuiz = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [overview, setOverview] =
    useState<QuizOverviewDraft>(initialOverviewValues);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const searchParams = useSearchParams();
  const quizType = (searchParams?.get("type") ?? "").toLowerCase();
  const moduleId = searchParams?.get("module_id") ?? null;

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
              try {
                // const quizDraft = {
                //   overview,
                //   questions,
                //   type: quizType || "module",
                //   module_id: quizType === "pre" || quizType === "post" ? undefined : moduleId,
                // };

                // persist directly into the advanced-spoil-draft store
                try {
                  const currentBasics = useCreateSpoilStore.getState().basics ?? {};
                  const quizPayload = {
                    id: String(Date.now()),
                    overview: overview,
                    questions: questions,
                    title: overview.title,
                    description: overview.description,
                  } as any;

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
                } catch {
                  // ignore any storage errors
                }

                toast.success("Quiz saved to draft");
                // return to outline / create-spoils page
                // router.push("/spoils/create-spoils");
              } catch  {
                // ignore
                toast.error("Failed to save quiz draft");
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
