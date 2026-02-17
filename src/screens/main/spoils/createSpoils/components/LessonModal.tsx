"use client";

import type { FC } from "react";

import { Form, Formik, type FormikHelpers } from "formik";
import * as yup from "yup";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Modal from "@spt/components/modal";
import Select from "@spt/components/select";
import Textarea from "@spt/components/textarea";

import ContentUpload from "./ContentUpload";

import type { LessonTypeOption } from "../types";

interface LessonFormState {
  title: string;
  type: LessonTypeOption;
  content: string;
  file: File | null;
}

interface LessonModalProps {
  open: boolean;
  isEditing: boolean;
  initialValues: LessonFormState;
  onClose: () => void;
  onSubmit: (
    values: LessonFormState,
    helpers: FormikHelpers<LessonFormState>,
  ) => void;
}

const lessonTypeOptions = [
  { label: "Video", value: "video" },
  { label: "Pdf", value: "pdf" },
  { label: "Text", value: "text" },
];

const lessonValidationSchema = yup.object({
  title: yup.string().trim().required("Lesson title is required"),
  type: yup
    .mixed<LessonTypeOption>()
    .oneOf(["video", "pdf", "text"], "Select lesson type")
    .required("Lesson type is required"),
  content: yup.string().when("type", {
    is: "text",
    then: (schema) => schema.trim().required("Lesson content is required"),
    otherwise: (schema) => schema.trim(),
  }),
  file: yup
    .mixed()
    .nullable()
    .when("type", {
      is: (value: LessonTypeOption) => value !== "text",
      then: (schema) =>
        schema
          .required("Upload lesson content")
          .test(
            "filePresent",
            "Upload lesson content",
            (value) => value instanceof File,
          ),
      otherwise: (schema) => schema.nullable(),
    }),
});

const LessonModal: FC<LessonModalProps> = ({
  open,
  isEditing,
  initialValues,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Lesson" : "Add Lesson"}
      size="lg"
    >
      <Formik<LessonFormState>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={lessonValidationSchema}
        onSubmit={onSubmit}
      >
        {({ values, isSubmitting, isValid }) => {
          const acceptType =
            values.type === "video"
              ? "video/*"
              : values.type === "pdf"
                ? "application/pdf"
                : undefined;

          return (
            <Form className="space-y-6">
              <Input
                name="title"
                label="Lesson Title"
                placeholder="Title"
                // hasAsterisk
              />

              <Select
                name="type"
                label="Lesson Type"
                placeholder="Select type"
                options={lessonTypeOptions}
                hasAsterisk
              />

              {values.type === "text" ? (
                <Textarea
                  name="content"
                  label="Content"
                  rows={5}
                  placeholder="Type in content"
                />
              ) : (
                <div className="space-y-1">
                  <ContentUpload
                    name="file"
                    label="Content Upload"
                    accept={acceptType}
                    hasAsterisk
                  />
                  <p className="text-sm text-gray">
                    {values.type === "video"
                      ? "Video should not be more than 5mins long"
                      : "Upload lesson as a PDF file"}
                  </p>
                </div>
              )}

              <Button type="submit" disabled={!isValid || isSubmitting} className="w-full">
                Save
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default LessonModal;
export type { LessonFormState };
