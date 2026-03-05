"use client";

import { useMemo, useState } from "react";

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
}

const AddQuestions = ({
  onNext,
  onPrevious,
  questions,
  onQuestionsChange,
}: AddQuestionsProps) => {
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  const editingQuestion = useMemo(
    () =>
      questions.find((question) => question.id === editingQuestionId) ?? null,
    [editingQuestionId, questions],
  );

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
