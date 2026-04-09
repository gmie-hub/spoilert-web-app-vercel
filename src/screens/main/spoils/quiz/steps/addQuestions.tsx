"use client";

import { useEffect, useMemo, useState } from "react";

import DeleteConfirmationModal from "@spt/components/deleteConfirmationModal";

import QuestionEmptyState from "../components/QuestionEmptyState";
import QuestionFormModal from "../components/QuestionFormModal";
import QuestionOutlineList from "../components/QuestionOutlineList";

import type { QuizQuestion } from "../types";

interface AddQuestionsProps {
  onNext: () => void;
  onPrevious: () => void;
  questions: QuizQuestion[];
  onQuestionsChange: (nextQuestions: QuizQuestion[]) => void;
  quizType?: string;
}

const AddQuestions = ({
  onNext,
  onPrevious,
  questions,
  onQuestionsChange,
  quizType,
}: AddQuestionsProps) => {
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  const editingQuestion = useMemo(
    () =>
      questions.find((question) => question.id === editingQuestionId) ?? null,
    [editingQuestionId, questions],
  );

  useEffect(() => {
    // if parent hasn't provided questions but there's a draft in sessionStorage,
    // populate from draft so user can see previously added questions.
    if (questions.length > 0) return;

    try {
      const storageKey = quizType === "post" ? "postspoil-quiz-init" : "prespoil-quiz-init";
      const presRaw = typeof window !== "undefined" && sessionStorage.getItem(storageKey);
      if (presRaw) {
        const pres = JSON.parse(presRaw);
        if (pres?.questions && Array.isArray(pres.questions) && pres.questions.length > 0) {
          // eslint-disable-next-line no-console
          console.log("restoring questions from prespoil-quiz-init", pres.questions);
          onQuestionsChange(pres.questions as QuizQuestion[]);
          return;
        }
      }

      const raw = typeof window !== "undefined" && sessionStorage.getItem("advanced-spoil-draft");
      if (raw) {
        const parsed = JSON.parse(raw);
        const key = quizType === "post" ? "postQuiz" : "preQuiz";
        const pre = parsed?.state?.basics?.[key] ?? parsed?.basics?.[key] ?? parsed?.[key] ?? null;
        const q = pre?.questions ?? null;
        if (q && Array.isArray(q) && q.length > 0) {
          // eslint-disable-next-line no-console
          console.log("restoring questions from advanced-spoil-draft.preQuiz", q);
          onQuestionsChange(q as QuizQuestion[]);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log("failed to restore questions from sessionStorage", e);
    }
  }, [questions, onQuestionsChange]);

  const openCreateQuestionModal = () => {
    setEditingQuestionId(null);
    setIsQuestionModalOpen(true);
  };

  const openEditQuestionModal = (questionId: string) => {
    setEditingQuestionId(questionId);
    setIsQuestionModalOpen(true);
  };

  const closeQuestionModal = () => {
    setEditingQuestionId(null);
    setIsQuestionModalOpen(false);
  };

  const saveQuestion = (question: QuizQuestion) => {
    const nextQuestions = (() => {
      const index = questions.findIndex(
        (existingQuestion) => existingQuestion.id === question.id,
      );

      if (index === -1) {
        return [...questions, question];
      }

      return questions.map((existingQuestion) =>
        existingQuestion.id === question.id ? question : existingQuestion,
      );
    })();

    onQuestionsChange(nextQuestions);
    closeQuestionModal();
  };

  const requestDeleteQuestion = (questionId: string) => {
    setDeletingQuestionId(questionId);
  };

  const deleteQuestion = () => {
    if (!deletingQuestionId) {
      return;
    }

    onQuestionsChange(
      questions.filter((question) => question.id !== deletingQuestionId),
    );
    setDeletingQuestionId(null);
  };

  return (
    <>
      {questions.length === 0 ? (
        <QuestionEmptyState
          onAddQuestion={openCreateQuestionModal}
          onPrevious={onPrevious}
        />
      ) : (
        <QuestionOutlineList
          questions={questions}
          onAddQuestion={openCreateQuestionModal}
          onDeleteQuestion={requestDeleteQuestion}
          onEditQuestion={openEditQuestionModal}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      )}

      <QuestionFormModal
        open={isQuestionModalOpen}
        editingQuestion={editingQuestion}
        onClose={closeQuestionModal}
        onSave={saveQuestion}
        quizType={quizType}
      />

      <DeleteConfirmationModal
        open={deletingQuestionId !== null}
        title="Are You Sure You Want To Delete This Question?"
        description="You won't be able to recover it once it is deleted"
        isLoading={false}
        onConfirm={deleteQuestion}
        onCancel={() => setDeletingQuestionId(null)}
      />
    </>
  );
};

export default AddQuestions;
