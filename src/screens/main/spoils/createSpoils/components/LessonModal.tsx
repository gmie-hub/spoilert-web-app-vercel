"use client";

import type { FC } from "react";

import { Form, Formik, type FormikHelpers } from "formik";
import * as yup from "yup";

import Button from "@spt/components/button";
import CustomUpload from "@spt/components/customUpload";
import Input from "@spt/components/input";
import Modal from "@spt/components/modal";
import Select from "@spt/components/select";
import Textarea from "@spt/components/textarea";

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
            <Form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
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
              </div>

              {values.type === "text" ? (
                <Textarea
                  name="content"
                  label="Content"
                  rows={5}
                  placeholder="Type in content"
                />
              ) : (
                <div className="space-y-1">
                  <CustomUpload
                    name="file"
                    label="Content Upload"
                    accept={acceptType}
                    placeholder={
                      values.type === "video"
                        ? "Upload lesson video"
                        : "Upload lesson pdf"
                    }
                    hasAsterisk
                  />
                  <p className="text-xs text-gray-500">
                    {values.type === "video"
                      ? "Video should not be more than 5mins long"
                      : "Upload lesson as a PDF file"}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  Save
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default LessonModal;
export type { LessonFormState };
