"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";

import Input from "@spt/components/input";
import RichTextEditor from "@spt/components/richTextEditor";
import Select from "@spt/components/select";
import { useCreateLessonMutation } from "@spt/hooks/apiRequests/useCreateLessonMutation";
import { htmlToPlainText } from "@spt/utils/richText";

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

// Adds a lesson to one of the Spoylz's modules, as the admin portal does.
const AddLessonModal = ({ moduleId, onClose }: { moduleId: number; onClose: () => void }) => {
  const queryClient = useQueryClient();
  const { createLessonHandler } = useCreateLessonMutation();
  const [file, setFile] = useState<File | null>(null);

  return (
    <ModalShell title="Add Lesson" onClose={onClose} widthClassName="max-w-[640px]">
      <Formik
        initialValues={{ title: "", type: "", content: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          if (values.type === "file" && !file) {
            toast.error("Upload a file for this lesson");
            return;
          }

          try {
            await createLessonHandler(moduleId, [
              {
                title: values.title.trim(),
                type: values.type,
                content: values.type === "text" ? values.content : undefined,
                file: values.type === "file" ? file : null,
              },
            ]);
            toast.success("Lesson added");
            queryClient.invalidateQueries({ queryKey: ["spoil-details"] });
            onClose();
          } catch {
            // createLessonHandler has already shown the error.
          }
        }}
      >
        {({ values, isSubmitting }) => (
          <Form className="space-y-5">
            <Input name="title" label="Lesson Title" placeholder="Title" />
            <Select name="type" label="Lesson Type" placeholder="Select lesson type" options={LESSON_TYPE_OPTIONS} />

            {values.type === "text" && (
              <RichTextEditor name="content" label="Content" placeholder="Write lesson content" />
            )}

            {values.type === "file" && <FileField label="Content Upload" file={file} onChange={setFile} />}

            <ModalActions
              onCancel={onClose}
              isSubmitting={isSubmitting}
              submitLabel="Add Lesson"
              submittingLabel="Adding..."
            />
          </Form>
        )}
      </Formik>
    </ModalShell>
  );
};

export default AddLessonModal;
