"use client";

import type { FC } from "react";

import { Form, Formik, type FormikHelpers } from "formik";
import { FiFile, FiX } from "react-icons/fi";
import * as yup from "yup";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Modal from "@spt/components/modal";
import RichTextEditor from "@spt/components/richTextEditor";
import Select from "@spt/components/select";
import Textarea from "@spt/components/textarea";
// import useCreateLessonMutation from "@spt/hooks/apiRequests/useCreateLessonMutation";
// import useUpdateLessonMutation from "@spt/hooks/apiRequests/useUpdateLessonMutation";

import ContentUpload from "./ContentUpload";

import type { LessonTypeOption } from "../types";

interface LessonFormState {
  title: string;
  type: LessonTypeOption;
  content: string;
  file: File | string | null;
  description: string;
}

interface LessonModalProps {
  open: boolean;
  isEditing: boolean;
  editingId?: string | null;
  initialValues: LessonFormState;
  moduleId: number | string | null;
  onClose: () => void;
  onSubmit: (
    values: LessonFormState,
    helpers: FormikHelpers<LessonFormState>,
    serverLessonId?: string | number,
  ) => void;
}

const lessonTypeOptions = [
  { label: "File", value: "file" },
  { label: "Text", value: "text" },
];

// Existing uploads arrive as a stored URL; show its (decoded) file name.
const getFileNameFromUrl = (url: string) => {
  const segment = url.split("/").pop() ?? url;

  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

const lessonValidationSchema = yup.object({
  title: yup.string().trim().required("Lesson title is required"),
  type: yup
    .mixed<LessonTypeOption>()
    .oneOf(["file",  "text"], "Select lesson type")
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
            (value) =>
              value instanceof File ||
              (typeof value === "string" && value.trim().length > 0),
          ),
      otherwise: (schema) => schema.nullable(),
    }),
  description: yup.string().trim(),
});

const LessonModal: FC<LessonModalProps> = ({
  open,
  isEditing,
  initialValues,
  onClose,
  onSubmit,
}) => {


  const handleFormSubmit = async (
    values: LessonFormState,
    helpers: FormikHelpers<LessonFormState>,
  ) => {
    // Always save locally via parent onSubmit (draft store is updated upstream)
    onSubmit(values, helpers);
    onClose();
    helpers.setSubmitting(false);
  };

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
        onSubmit={handleFormSubmit}
      >
        {({ values, isValid, setFieldValue }) => {
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
                <RichTextEditor
                  name="content"
                  label="Content"
                  placeholder="Type in content"
                />
              ) : typeof values.file === "string" && values.file.trim() ? (
                <div className="flex w-full flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Content Upload<span className="ml-1 text-red-500">*</span>
                  </label>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-blue bg-white px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <FiFile className="shrink-0 text-blue" size={18} />
                      <span className="truncate text-sm font-medium text-gray-700">
                        {getFileNameFromUrl(values.file)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFieldValue("file", null)}
                      aria-label="Remove file"
                      className="shrink-0 rounded-full p-1 text-gray-500 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <ContentUpload
                    name="file"
                    label="Content Upload"
                    accept={acceptType}
                    hasAsterisk
                  />
                  {/* <p className="text-sm text-gray">
                    {values.type === "video"
                      ? "Video should not be more than 5mins long"
                      : "Upload lesson as a PDF file"}
                  </p> */}
                </div>
              )}
              <Textarea
                name="description"
                label="Description (Optional)"
                rows={3}
                placeholder="Add a brief description"
              />
              <Button type="submit" disabled={!isValid} className="w-full">
                {"Save"}
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
