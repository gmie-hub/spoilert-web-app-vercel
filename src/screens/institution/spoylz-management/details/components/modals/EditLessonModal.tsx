"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";

import Input from "@spt/components/input";
import RichTextEditor from "@spt/components/richTextEditor";
import Select from "@spt/components/select";
import { useUpdateLessonMutation } from "@spt/hooks/apiRequests/useUpdateLessonMutation";
import type { SpoilLesson } from "@spt/screens/main/spoil/startSpoilUtils";
import { htmlToPlainText } from "@spt/utils/richText";

import { humanize } from "../../../../lecturers/utils";

import FileField from "./FileField";
import ModalShell, { ModalActions } from "./ModalShell";

const LESSON_TYPE_OPTIONS = [
  { label: "File", value: "file" },
  { label: "Text", value: "text" },
];

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Lesson title is required"),
  type: Yup.string().required("Lesson type is required"),
  content: Yup.string().when("type", {
    is: "text",
    then: (schema) =>
      schema.test("has-content", "Content is required", (value) => Boolean(htmlToPlainText(value).trim())),
    otherwise: (schema) => schema,
  }),
});

const EditLessonModal = ({ lesson, onClose }: { lesson: SpoilLesson; onClose: () => void }) => {
  const queryClient = useQueryClient();
  const { updateLessonHandler } = useUpdateLessonMutation();
  const [file, setFile] = useState<File | null>(null);

  // Keep a lesson's existing type selectable even if it isn't one of the two offered.
  const typeOptions =
    !lesson.type || LESSON_TYPE_OPTIONS.some((option) => option.value === lesson.type)
      ? LESSON_TYPE_OPTIONS
      : [...LESSON_TYPE_OPTIONS, { label: humanize(lesson.type), value: lesson.type }];

  return (
    <ModalShell title="Edit Lesson" onClose={onClose} widthClassName="max-w-[640px]">
      <Formik
        initialValues={{
          title: lesson.title ?? "",
          type: lesson.type || "text",
          content: lesson.content ?? "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          if (values.type !== "text" && !file && !lesson.content_url) {
            toast.error("Upload a file for this lesson");
            return;
          }

          try {
            await updateLessonHandler({
              lessonId: lesson.id,
              title: values.title.trim(),
              type: values.type,
              content: values.content,
              file,
              // The update always sends a description; pass the current one so saving doesn't wipe it.
              description: lesson.description ?? "",
            });
            queryClient.invalidateQueries({ queryKey: ["spoil-details"] });
            onClose();
          } catch {
            // updateLessonHandler has already shown the error.
          }
        }}
      >
        {({ values, isSubmitting }) => (
          <Form className="space-y-5">
            <Input name="title" label="Lesson Title" placeholder="Title" />
            <Select name="type" label="Lesson Type" placeholder="Select lesson type" options={typeOptions} />

            {values.type === "text" ? (
              <RichTextEditor name="content" label="Content" placeholder="Write lesson content" />
            ) : (
              <FileField
                label="Content Upload"
                file={file}
                onChange={setFile}
                hint={lesson.content_url ? "Leave this empty to keep the file already on this lesson." : undefined}
              />
            )}

            <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </ModalShell>
  );
};

export default EditLessonModal;
