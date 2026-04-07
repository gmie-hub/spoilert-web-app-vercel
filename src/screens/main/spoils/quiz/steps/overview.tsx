"use client";

import { FC } from "react";

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
  return (
    <Card>
      <Formik<QuizOverviewDraft>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={buildValidationSchema(quizType)}
        validateOnBlur
        validateOnChange
        onSubmit={(values) => {
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
