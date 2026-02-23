"use client";

import type { FC } from "react";

import { Form, Formik, type FormikHelpers } from "formik";
import * as yup from "yup";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Modal from "@spt/components/modal";
import Select from "@spt/components/select";
import Textarea from "@spt/components/textarea";
import useCreateLessonMutation from "@spt/hooks/apiRequests/useCreateLessonMutation";
import useUpdateLessonMutation from "@spt/hooks/apiRequests/useUpdateLessonMutation";

import ContentUpload from "./ContentUpload";

import type { LessonTypeOption } from "../types";

interface LessonFormState {
  title: string;
  type: LessonTypeOption;
  content: string;
  file: File | null;
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
  description: yup.string().trim(),
});

const LessonModal: FC<LessonModalProps> = ({
  open,
  isEditing,
  editingId,
  initialValues,
  moduleId,
  onClose,
  onSubmit,
}) => {
  const { createLessonHandler, isLoading: isCreatingLesson } =
    useCreateLessonMutation();
  const { updateLessonHandler, isUpdating } = useUpdateLessonMutation();

  const handleFormSubmit = async (
    values: LessonFormState,
    helpers: FormikHelpers<LessonFormState>,
  ) => {
    // When editing & we have a server lesson id, call update API
    if (isEditing && editingId) {
      try {
        await updateLessonHandler({
          lessonId: editingId,
          title: values.title,
          type: values.type,
          content: values.content,
          file: values.file,
          description: values.description,
        });
        onSubmit(values, helpers);
        onClose();
      } catch {
        // updateLessonHandler shows toast; keep modal open
        helpers.setSubmitting(false);
      }
      return;
    }

    // When editing locally (no server id)
    if (isEditing) {
      onSubmit(values, helpers);
      return;
    }

    // When creating & moduleId exists, call API first
    if (moduleId) {
      try {
        const res = await createLessonHandler(moduleId, [
          {
            title: values.title,
            type: values.type,
            content: values.content,
            file: values.file,
            description: values.description,
          },
        ]);
        const serverLessonId =
          res?.data?.id ?? res?.data?.[0]?.id ?? res?.data?.data?.id ?? null;
        onSubmit(values, helpers, serverLessonId ?? undefined);
        onClose();
      } catch {
        // createLessonHandler shows toast; keep modal open
        helpers.setSubmitting(false);
        return;
      }
    } else {
      // No moduleId yet, save locally
      onSubmit(values, helpers);
    }
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
        {({ values, isValid }) => {
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
              <Textarea
                name="description"
                label="Description (Optional)"
                rows={3}
                placeholder="Add a brief description"
              />
              <Button type="submit" disabled={!isValid || isCreatingLesson || isUpdating} className="w-full">
                {isCreatingLesson || isUpdating ? 'Saving...' : 'Save'}
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
