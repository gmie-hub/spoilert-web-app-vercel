"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";

import Input from "@spt/components/input";
import Textarea from "@spt/components/textarea";
import { updateQuizAndQuestions } from "@spt/screens/main/spoils/createSpoils/utils/quizHelpers";
import type { QuizDetailsData } from "@spt/types/quiz";
import { getApiErrorMessage } from "@spt/utils/creationFailures";

import ModalShell, { ModalActions } from "./ModalShell";

const wholeNumber = (label: string, min: number, max: number) =>
  Yup.number()
    .transform((value, original) => (original === "" ? undefined : value))
    .typeError(`${label} must be a number`)
    .integer(`${label} must be a whole number`)
    .min(min, `${label} must be at least ${min}`)
    .max(max, `${label} cannot exceed ${max}`)
    .required(`${label} is required`);

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Quiz title is required"),
  description: Yup.string().trim().required("Description is required"),
  no_of_questions: wholeNumber("Number of questions", 1, 100),
  time_limit: wholeNumber("Time limit", 0, 1440),
  pass_mark: wholeNumber("Passmark", 0, 100),
});

// Pre-Spoylz quizzes have no pass mark (0 is sent to the API instead).
const preQuizValidationSchema = validationSchema.omit(["pass_mark"]);

const EditQuizModal = ({ quiz, onClose }: { quiz: QuizDetailsData; onClose: () => void }) => {
  const queryClient = useQueryClient();
  const isPreQuiz = quiz.type === "pre";

  return (
    <ModalShell title="Edit Quiz" onClose={onClose}>
      <Formik
        initialValues={{
          title: quiz.title ?? "",
          description: quiz.description ?? "",
          no_of_questions: quiz.no_of_questions != null ? String(quiz.no_of_questions) : "",
          time_limit: quiz.time_limit != null ? String(quiz.time_limit) : "",
          pass_mark: quiz.pass_mark != null ? String(quiz.pass_mark) : "",
        }}
        validationSchema={isPreQuiz ? preQuizValidationSchema : validationSchema}
        onSubmit={async (values) => {
          try {
            // POST /quiz/{id} with _method=patch. The quiz keeps its type, spoil
            // and module; its questions are edited one at a time.
            await updateQuizAndQuestions(
              quiz.id,
              {
                title: values.title.trim(),
                description: values.description.trim(),
                numberOfQuestions: values.no_of_questions,
                timeLimit: values.time_limit,
                passmark: values.pass_mark,
              },
              [],
              { type: quiz.type, spoilId: quiz.spoil_id, moduleId: quiz.module_id ?? undefined },
            );
            toast.success("Quiz updated");
            queryClient.invalidateQueries({ queryKey: ["getQuizDetails"] });
            queryClient.invalidateQueries({ queryKey: ["getQuizBySpoilId"] });
            onClose();
          } catch (error) {
            toast.error(getApiErrorMessage(error, "Failed to update quiz. Try again."));
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <Input name="title" label="Quiz Title" placeholder="Introduction to frontend development" />
            <Textarea name="description" label="Description" placeholder="Test your knowledge of the basics" rows={3} />
            <Input name="no_of_questions" label="Number of Questions" placeholder="10" numericOnly />
            <Input name="time_limit" label="Time Limit (Minutes)" placeholder="50" numericOnly />
            {!isPreQuiz && (
              <Input name="pass_mark" label="Passmark (%)" placeholder="50" numericOnly />
            )}
            <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </ModalShell>
  );
};

export default EditQuizModal;
