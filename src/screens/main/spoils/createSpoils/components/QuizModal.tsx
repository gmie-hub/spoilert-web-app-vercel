"use client";

import type { FC } from "react";

import { Form, Formik, type FormikHelpers } from "formik";
import * as yup from "yup";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Modal from "@spt/components/modal";
import Textarea from "@spt/components/textarea";

interface QuizFormState {
  title: string;
  description: string;
}

interface QuizModalProps {
  open: boolean;
  variant: "pre" | "post";
  initialValues: QuizFormState;
  onClose: () => void;
  onSubmit: (
    values: QuizFormState,
    helpers: FormikHelpers<QuizFormState>,
  ) => void;
}

const quizValidationSchema = yup.object({
  title: yup.string().trim().required("Quiz title is required"),
  description: yup.string().trim(),
});

const QuizModal: FC<QuizModalProps> = ({
  open,
  variant,
  initialValues,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${variant === "pre" ? "Pre" : "Post"}-Spoil Quiz`}
    >
      <Formik<QuizFormState>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={quizValidationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="space-y-4">
            <Input
              name="title"
              label="Quiz Title"
              placeholder="Title"
              hasAsterisk
            />

            <Textarea
              name="description"
              label="Description"
              rows={4}
              placeholder="Add a small description"
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save Quiz
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default QuizModal;
export type { QuizFormState };
