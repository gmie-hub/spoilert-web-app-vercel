"use client";

import { FC } from "react";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Textarea from "@spt/components/textarea";

interface OverviewFormValues {
  title: string;
  description: string;
  numberOfQuestions: string;
  timeLimit: string;
}

interface OverviewProps {
  onNext: () => void;
}

const initialValues: OverviewFormValues = {
  title: "",
  description: "",
  numberOfQuestions: "",
  timeLimit: "",
};

const validationSchema = Yup.object({
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
    .typeError("Number of questions must be a number")
    .integer("Number of questions must be a whole number")
    .min(1, "Number of questions must be at least 1")
    .max(100, "Number of questions cannot exceed 100")
    .required("Number of questions is required"),
  timeLimit: Yup.number()
    .typeError("Time limit must be a number")
    .integer("Time limit must be a whole number")
    .min(1, "Time limit must be at least 1 minute")
    .max(600, "Time limit cannot exceed 600 minutes")
    .required("Time limit is required"),
});

const Overview: FC<OverviewProps> = ({ onNext }) => {
  return (
    <div className="rounded-3xl p-6 md:p-8">
      <Formik<OverviewFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnBlur
        validateOnChange
        onSubmit={() => {
          onNext();
        }}
      >
        {({ values, isSubmitting, setTouched }) => (
          <Form className="space-y-6">
            <h2 className="text-4 font-semibold text-[#212121]">Overview</h2>

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

            <Button
              type="submit"
              variant="lightBlue"
              disabled={isSubmitting}
              className="mt-2 w-full !rounded-2xl !py-4 text-xl font-semibold text-white"
              onClick={() =>
                setTouched(
                  Object.keys(values).reduce(
                    (acc, key) => ({ ...acc, [key]: true }),
                    {} as Record<keyof OverviewFormValues, boolean>,
                  ),
                )
              }
            >
              Save and continue
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Overview;
