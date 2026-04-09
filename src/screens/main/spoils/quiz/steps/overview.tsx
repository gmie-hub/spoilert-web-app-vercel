"use client";

import { FC, useEffect, useState } from "react";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import { Card } from "@spt/components";
import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Textarea from "@spt/components/textarea";

import type { QuizOverviewDraft } from "../types";

interface OverviewProps {
  initialValues: QuizOverviewDraft;
  onSaveAndNext: (values: QuizOverviewDraft) => void;
  quizType?: string;
}

const buildValidationSchema = (quizType?: string) =>
  Yup.object({
  title: Yup.string()
    .trim()
    .min(3, "Quiz title must be at least 3 characters")
    .max(120, "Quiz title cannot exceed 120 characters")
    .required("Quiz title is required"),
  description: Yup.string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters")
    .required("Description is required"),
  numberOfQuestions: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Number of questions must be a number")
    .integer("Number of questions must be a whole number")
    .min(1, "Number of questions must be at least 1")
    .max(100, "Number of questions cannot exceed 100")
    .required("Number of questions is required"),
  timeLimit: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Time limit must be a number")
    .integer("Time limit must be a whole number")
    .min(1, "Time limit must be at least 1 minute")
    .max(600, "Time limit cannot exceed 600 minutes")
    .required("Time limit is required"),
    passmark:
      quizType === "post"
        ? Yup.number()
            .transform((value, originalValue) =>
              originalValue === "" ? undefined : value,
            )
            .typeError("Passmark must be a number")
            .integer("Passmark must be a whole number")
            .min(0, "Passmark must be at least 0")
            .max(100, "Passmark cannot exceed 100")
            .required("Passmark is required for post-quiz")
        : Yup.mixed().notRequired(),
  });

const Overview: FC<OverviewProps> = ({
  initialValues,
  onSaveAndNext,
  quizType,
}) => {
  const [derivedInitial, setDerivedInitial] = useState<QuizOverviewDraft>(initialValues);

  useEffect(() => {
    const build = async () => {
      let init: QuizOverviewDraft = { ...initialValues };

      try {
        if (typeof window !== "undefined") {
          const storageKey = quizType === "post" ? "postspoil-quiz-init" : "prespoil-quiz-init";
          const presRaw = sessionStorage.getItem(storageKey);
          if (presRaw) {
              const pres = JSON.parse(presRaw);
              init.title = pres.title ?? pres.overview?.title ?? init.title;
              init.description = pres.description ?? pres.overview?.description ?? init.description;
              init.numberOfQuestions = pres.numberOfQuestions ?? (pres.overview?.numberOfQuestions ? String(pres.overview.numberOfQuestions) : init.numberOfQuestions);
              init.timeLimit = pres.timeLimit ?? (pres.overview?.timeLimit ? String(pres.overview.timeLimit) : init.timeLimit);
              init.passmark = pres.passmark ?? (pres.overview?.passmark ? String(pres.overview.passmark) : init.passmark);
          } else {
            const raw = sessionStorage.getItem("advanced-spoil-draft");
            if (raw) {
              const parsed = JSON.parse(raw);
              const pre = parsed?.state?.basics?.[quizType === "post" ? "postQuiz" : "preQuiz"] ?? parsed?.basics?.[quizType === "post" ? "postQuiz" : "preQuiz"] ?? parsed?.[quizType === "post" ? "postQuiz" : "preQuiz"] ?? null;
              if (pre) {
                init.title = pre.overview?.title ?? init.title;
                init.description = pre.overview?.description ?? init.description;
                init.numberOfQuestions = pre.overview?.numberOfQuestions ? String(pre.overview.numberOfQuestions) : init.numberOfQuestions;
                init.timeLimit = pre.overview?.timeLimit ? String(pre.overview.timeLimit) : init.timeLimit;
                init.passmark = pre.overview?.passmark ? String(pre.overview.passmark) : init.passmark;
              }
            }
          }
        }
      } catch (e) {
        // ignore parse errors and keep initialValues
      }

      setDerivedInitial(init);
    };

    build();
  }, [initialValues]);

  console.log(derivedInitial,'derivedInitial')

  return (
    <Card>
      <Formik<QuizOverviewDraft>
        initialValues={derivedInitial}
        enableReinitialize
        validationSchema={buildValidationSchema(quizType)}
        validateOnBlur
        validateOnChange
        onSubmit={(values) => {
          try {
            if (typeof window !== "undefined") {
              const storageKey = quizType === "post" ? "postspoil-quiz-init" : "prespoil-quiz-init";
              const presRaw = sessionStorage.getItem(storageKey);
              if (presRaw) {
                try {
                  const pres = JSON.parse(presRaw);
                  pres.title = values.title ?? pres.title;
                  pres.description = values.description ?? pres.description;
                  pres.numberOfQuestions = values.numberOfQuestions ?? pres.numberOfQuestions;
                  pres.timeLimit = values.timeLimit ?? pres.timeLimit;
                  if (values.passmark !== undefined) pres.passmark = values.passmark;
                  sessionStorage.setItem(storageKey, JSON.stringify(pres));
                } catch (e) {
                  // fallback: overwrite
                  sessionStorage.setItem(
                    storageKey,
                    JSON.stringify({ overview: values, ...values }),
                  );
                }
              } else {
                const raw = sessionStorage.getItem("advanced-spoil-draft");
                if (raw) {
                  try {
                    const parsed = JSON.parse(raw);
                    const quizKey = quizType === "post" ? "postQuiz" : "preQuiz";
                    const prePath = parsed?.state?.basics ? parsed.state.basics : parsed.basics ? parsed.basics : parsed;
                    if (prePath) {
                      // if nested state.basics[quizKey] exists, update it
                      if (parsed.state && parsed.state.basics && parsed.state.basics[quizKey]) {
                        parsed.state.basics[quizKey].overview = {
                          title: values.title,
                          description: values.description,
                          numberOfQuestions: values.numberOfQuestions,
                          timeLimit: values.timeLimit,
                          passmark: values.passmark,
                        };
                      } else if (parsed[quizKey]) {
                        parsed[quizKey].overview = {
                          title: values.title,
                          description: values.description,
                          numberOfQuestions: values.numberOfQuestions,
                          timeLimit: values.timeLimit,
                          passmark: values.passmark,
                        };
                      } else {
                        // fallback: store storageKey separately
                        sessionStorage.setItem(
                          storageKey,
                          JSON.stringify({ overview: values, ...values }),
                        );
                        onSaveAndNext(values);
                        return;
                      }

                      sessionStorage.setItem("advanced-spoil-draft", JSON.stringify(parsed));
                    } else {
                      // no structured place to store, set storageKey
                      sessionStorage.setItem(
                        storageKey,
                        JSON.stringify({ overview: values, ...values }),
                      );
                    }
                  } catch (e) {
                    sessionStorage.setItem(
                      storageKey,
                      JSON.stringify({ overview: values, ...values }),
                    );
                  }
                } else {
                  // neither present — create storageKey
                  sessionStorage.setItem(
                    storageKey,
                    JSON.stringify({ overview: values, ...values }),
                  );
                }
              }
            }
          } catch (err) {
            // ignore storage errors
            // eslint-disable-next-line no-console
            console.log("failed to persist quiz overview to sessionStorage", err);
          }

          onSaveAndNext(values);
        }}
      >
        {({ values, isSubmitting, setTouched }) => (
          <Form className="space-y-6">
            <h2 className="text-3xl font-semibold text-[#212121]">Overview</h2>

            <Input
              name="title"
              label="Quiz Title"
              placeholder="Enter a title for your quiz"
            />

            <Textarea
              name="description"
              label="Description"
              placeholder="Write a short description for learners"
              rows={5}
            />

            <Input
              name="numberOfQuestions"
              label="Number of Questions"
              placeholder="How many questions?"
              type="number"
            />

            <Input
              name="timeLimit"
              label="Time Limit"
              placeholder="Set time limit for the whole quiz"
              type="number"
            />

            {quizType === "post" && (
              <Input
                name="passmark"
                label="Passmark"
                placeholder="Enter passmark (e.g. 50)"
                type="number"
              />
            )}

            <Button
              type="submit"
              variant="darkBlue"
              disabled={isSubmitting}
              className="mt-2 w-full"
              onClick={() =>
                setTouched(
                  Object.keys(values).reduce(
                    (acc, key) => ({ ...acc, [key]: true }),
                    {} as Record<keyof QuizOverviewDraft, boolean>,
                  ),
                )
              }
            >
              Save and continue
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default Overview;
