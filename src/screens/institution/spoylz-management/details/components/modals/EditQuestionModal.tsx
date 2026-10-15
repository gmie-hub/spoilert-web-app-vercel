"use client";

import { useQueryClient } from "@tanstack/react-query";
import { FieldArray, Form, Formik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";

import Input from "@spt/components/input";
import Select from "@spt/components/select";
import Textarea from "@spt/components/textarea";
import { updateQuestion } from "@spt/screens/main/spoils/createSpoils/utils/quizHelpers";
import type { QuizDetailsData } from "@spt/types/quiz";
import { getApiErrorMessage } from "@spt/utils/creationFailures";

import { FILL_IN_THE_BLANK, MULTIPLE_CHOICE, parseQuizOptions } from "../../../mappers";

import ModalShell, { ModalActions } from "./ModalShell";

export type QuizQuestion = QuizDetailsData["questions"][number];

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 4;

const QUESTION_TYPE_OPTIONS = [
  { value: MULTIPLE_CHOICE, label: "Multiple Choice Questions" },
  { value: FILL_IN_THE_BLANK, label: "Fill in the Blank" },
];

interface QuestionValues {
  type: string;
  question: string;
  answer: string;
  options: { text: string }[];
  // Index of the option marked as the answer; -1 when none is.
  correctIndex: number;
}

const validationSchema = Yup.object({
  type: Yup.string().oneOf([MULTIPLE_CHOICE, FILL_IN_THE_BLANK], "Select a question type").required("Select a question type"),
  question: Yup.string().trim().required("Question is required"),
  answer: Yup.string().when("type", {
    is: FILL_IN_THE_BLANK,
    then: (schema) => schema.trim().required("Answer is required"),
    otherwise: (schema) => schema,
  }),
  options: Yup.array().when("type", {
    is: MULTIPLE_CHOICE,
    then: () =>
      Yup.array()
        .of(Yup.object({ text: Yup.string().trim().required("Every option needs text") }))
        .min(MIN_OPTIONS, `Add at least ${MIN_OPTIONS} options`)
        .max(MAX_OPTIONS, `A maximum of ${MAX_OPTIONS} options is allowed`),
    otherwise: () => Yup.array(),
  }),
  correctIndex: Yup.number().when("type", {
    is: MULTIPLE_CHOICE,
    then: (schema) => schema.min(0, "Select the correct answer"),
    otherwise: (schema) => schema,
  }),
});

const toInitialValues = (question: QuizQuestion): QuestionValues => {
  const options = parseQuizOptions(question.options);
  const padded = [...options, ...Array(Math.max(0, MIN_OPTIONS - options.length)).fill("")];

  return {
    type: question.type || MULTIPLE_CHOICE,
    question: question.question ?? "",
    answer: question.answer ?? "",
    options: padded.map((text) => ({ text })),
    correctIndex: options.indexOf(question.answer),
  };
};

const EditQuestionModal = ({ question, onClose }: { question: QuizQuestion; onClose: () => void }) => {
  const queryClient = useQueryClient();

  return (
    <ModalShell title="Edit Question" onClose={onClose} widthClassName="max-w-[640px]">
      <Formik
        initialValues={toInitialValues(question)}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          const isMultipleChoice = values.type === MULTIPLE_CHOICE;

          try {
            // POST /questions/{id} with _method=patch, as the admin portal sends it.
            await updateQuestion(
              question.id,
              {
                question: values.question.trim(),
                type: values.type,
                // A multiple choice answer is the text of the option marked correct.
                answer: isMultipleChoice
                  ? (values.options[values.correctIndex]?.text.trim() ?? "")
                  : values.answer.trim(),
                options: isMultipleChoice ? values.options.map((option) => option.text.trim()) : undefined,
              },
              question.quiz_id,
            );
            toast.success("Question updated");
            queryClient.invalidateQueries({ queryKey: ["getQuizDetails"] });
            onClose();
          } catch (error) {
            toast.error(getApiErrorMessage(error, "Failed to update question. Try again."));
          }
        }}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form className="space-y-5">
            <Select
              name="type"
              label="Question Type"
              placeholder="Select your question type"
              options={QUESTION_TYPE_OPTIONS}
            />
            <Textarea name="question" label="Question" placeholder="Write the question" rows={3} />

            {values.type === MULTIPLE_CHOICE ? (
              <FieldArray name="options">
                {({ push, remove }) => (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Options (select the correct answer)</p>

                    {values.options.map((_, index) => (
                      <div key={index} className="flex items-end gap-3">
                        <input
                          type="radio"
                          name="correctIndex"
                          aria-label={`Mark option ${index + 1} as the answer`}
                          checked={values.correctIndex === index}
                          onChange={() => setFieldValue("correctIndex", index)}
                          className="mb-4 h-4 w-4 shrink-0 accent-[var(--color-blue)]"
                        />
                        <div className="min-w-0 flex-1">
                          <Input
                            name={`options.${index}.text`}
                            label={`Option ${String.fromCharCode(65 + index)}`}
                            placeholder="Option text"
                          />
                        </div>
                        {values.options.length > MIN_OPTIONS && (
                          <button
                            type="button"
                            onClick={() => {
                              remove(index);
                              // Keep the marked answer on the same option after the list shifts.
                              if (values.correctIndex === index) setFieldValue("correctIndex", -1);
                              else if (values.correctIndex > index) setFieldValue("correctIndex", values.correctIndex - 1);
                            }}
                            className="mb-3 shrink-0 text-sm font-medium text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}

                    {values.options.length < MAX_OPTIONS && (
                      <button
                        type="button"
                        onClick={() => push({ text: "" })}
                        className="text-sm font-medium text-[var(--color-blue)]"
                      >
                        + Add option
                      </button>
                    )}

                    {(touched.correctIndex || touched.options) &&
                      (typeof errors.options === "string" || errors.correctIndex) && (
                        <p className="text-xs text-red-500">
                          {typeof errors.options === "string" ? errors.options : errors.correctIndex}
                        </p>
                      )}
                  </div>
                )}
              </FieldArray>
            ) : (
              <Input name="answer" label="Answer" placeholder="Write the answer" />
            )}

            <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </ModalShell>
  );
};

export default EditQuestionModal;
