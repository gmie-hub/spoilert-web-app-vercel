"use client";

import { FC, useMemo } from "react";

import Stack from "@mui/material/Stack";
import { Form, Formik } from "formik";
import { FiInfo } from "react-icons/fi";
import * as Yup from "yup";

import Button from "@spt/components/button";
import Modal from "@spt/components/modal";
import Select from "@spt/components/select";
import Textarea from "@spt/components/textarea";

import {
  MULTIPLE_CHOICE_MAX_OPTIONS,
  MULTIPLE_CHOICE_MIN_OPTIONS,
  QUESTION_TYPE_OPTIONS,
  buildQuestionFromDraft,
  createEmptyOption,
  mapQuestionToDraft,
} from "../questionHelpers";

import QuestionOptionsEditor from "./QuestionOptionsEditor";

import type {
  QuizQuestion,
  QuizQuestionDraft,
  QuizQuestionType,
} from "../types";

interface QuestionFormModalProps {
  editingQuestion: QuizQuestion | null;
  onClose: () => void;
  onSave: (question: QuizQuestion) => void;
  open: boolean;
}

const QuestionFormModal: FC<QuestionFormModalProps> = ({
  editingQuestion,
  onClose,
  onSave,
  open,
}) => {
  const isEditing = useMemo(() => Boolean(editingQuestion), [editingQuestion]);
  const initialValues = useMemo(
    () => mapQuestionToDraft(editingQuestion),
    [editingQuestion, open],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Question" : "Add Questions"}
      size="lg"
    >
      <Formik<QuizQuestionDraft>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={questionFormValidationSchema}
        onSubmit={(values) => {
          const question = buildQuestionFromDraft(values, editingQuestion?.id);
          onSave(question);
        }}
      >
        {({ errors, isSubmitting, setFieldValue, submitCount, values }) => {
          const optionErrors =
            submitCount > 0 && typeof errors.options === "string"
              ? errors.options
              : undefined;

          const handleTypeChange = (nextValue: string) => {
            const nextType = nextValue as QuizQuestionType;

            if (nextType === "multiple_choice") {
              const existingOptions = values.options.slice(
                0,
                MULTIPLE_CHOICE_MAX_OPTIONS,
              );

              while (existingOptions.length < MULTIPLE_CHOICE_MIN_OPTIONS) {
                existingOptions.push(createEmptyOption());
              }

              setFieldValue("options", existingOptions);
              return;
            }

            setFieldValue("options", []);
          };

          const handleAddOption = () => {
            if (values.options.length >= MULTIPLE_CHOICE_MAX_OPTIONS) {
              return;
            }

            setFieldValue("options", [...values.options, createEmptyOption()]);
          };

          const handleRemoveOption = (optionId: string) => {
            if (values.options.length <= MULTIPLE_CHOICE_MIN_OPTIONS) {
              return;
            }

            setFieldValue(
              "options",
              values.options.filter((option) => option.id !== optionId),
            );
          };

          const handleToggleCorrect = (optionId: string) => {
            setFieldValue(
              "options",
              values.options.map((option) => ({
                ...option,
                isCorrect: option.id === optionId,
              })),
            );
          };

          return (
            <Form className="space-y-6">
              <Stack spacing={1}>
                <Select
                  name="type"
                  label="Question Type"
                  placeholder="Select your question type"
                  options={QUESTION_TYPE_OPTIONS}
                  onChange={handleTypeChange}
                />

                {/* {values.type === "multiple_choice" && ( */}
                  <div className="flex items-center gap-2 text-sm text-[#5A5A5A]">
                    <FiInfo className="mt-0.5 h-4 w-4" />
                    <p>
                      For multiple choice questions, you can add a minimum of
                      two options and a maximum of 4 options
                    </p>
                  </div>
                {/* )} */}
              </Stack>

              <Textarea
                name="prompt"
                label="Question"
                placeholder="Enter your question"
                rows={4}
                className="!text-base"
              />

              {values.type === "multiple_choice" && (
                <QuestionOptionsEditor
                  options={values.options}
                  onAddOption={handleAddOption}
                  onRemoveOption={handleRemoveOption}
                  onToggleCorrect={handleToggleCorrect}
                  error={optionErrors}
                />
              )}

              {values.type === "fill_in_the_blank" && (
                <Textarea
                  name="answer"
                  label="Enter the Answer"
                  placeholder="Enter the answer to the question here"
                  rows={4}
                  className="!text-base"
                />
              )}

              <Button
                type="submit"
                variant="darkBlue"
                className="w-full !rounded-2xl !bg-[#013B4D] font-semibold text-white hover:!bg-[#0D4F63]"
                disabled={isSubmitting}
              >
                Save
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default QuestionFormModal;

const questionFormValidationSchema = Yup.object({
  answer: Yup.string().when("type", {
    is: "fill_in_the_blank",
    then: (schema) => schema.trim().required("Answer is required"),
    otherwise: (schema) => schema.trim(),
  }),
  options: Yup.array().when("type", {
    is: "multiple_choice",
    then: () =>
      Yup.array()
        .of(
          Yup.object({
            id: Yup.string().required(),
            isCorrect: Yup.boolean().required(),
            text: Yup.string().trim().required("Enter option"),
          }),
        )
        .min(MULTIPLE_CHOICE_MIN_OPTIONS, "Add at least 2 options")
        .max(MULTIPLE_CHOICE_MAX_OPTIONS, "A maximum of 4 options is allowed")
        .test(
          "single-correct-answer",
          "Select one correct answer",
          (options) =>
            Boolean(
              options && options.filter((option) => option.isCorrect).length === 1,
            ),
        ),
    otherwise: () => Yup.array().default([]),
  }),
  prompt: Yup.string().trim().required("Question is required"),
  type: Yup.mixed<QuizQuestionType>()
    .oneOf(["multiple_choice", "fill_in_the_blank"], "Select a question type")
    .required("Select a question type"),
});
