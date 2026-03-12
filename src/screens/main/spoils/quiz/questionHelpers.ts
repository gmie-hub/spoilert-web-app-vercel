import type {
  QuizQuestion,
  QuizQuestionDraft,
  QuizQuestionOption,
  QuizQuestionType,
} from "./types";

interface QuestionTypeOption {
  label: string;
  value: QuizQuestionType;
}

export interface QuestionDraftErrors {
  answer?: string;
  options?: string;
  prompt?: string;
  type?: string;
}

export const MULTIPLE_CHOICE_MAX_OPTIONS = 4;
export const MULTIPLE_CHOICE_MIN_OPTIONS = 2;

export const QUESTION_TYPE_OPTIONS: QuestionTypeOption[] = [
  {
    label: "Multiple Choice Questions",
    value: "multiple_choice",
  },
  {
    label: "Fill in the Blank",
    value: "fill_in_the_blank",
  },
];

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export const createEmptyOption = (): QuizQuestionOption => ({
  id: createId(),
  isCorrect: false,
  text: "",
});

export const createDefaultQuestionDraft = (): QuizQuestionDraft => ({
  answer: "",
  options: [createEmptyOption(), createEmptyOption()],
  prompt: "",
  type: "",
});

export const mapQuestionToDraft = (
  question: QuizQuestion | null,
): QuizQuestionDraft => {
  if (!question) {
    return createDefaultQuestionDraft();
  }

  return {
    answer: question.answer,
    options: question.options.map((option) => ({ ...option })),
    prompt: question.prompt,
    type: question.type,
  };
};

export const buildQuestionFromDraft = (
  draft: QuizQuestionDraft,
  existingQuestionId?: string,
): QuizQuestion => {
  const questionType = draft.type as QuizQuestionType;
  const prompt = draft.prompt.trim();
  const answer =
    questionType === "fill_in_the_blank" ? draft.answer.trim() : "";
  const options =
    questionType === "multiple_choice"
      ? draft.options.slice(0, MULTIPLE_CHOICE_MAX_OPTIONS).map((option) => ({
          ...option,
          text: option.text.trim(),
        }))
      : [];

  return {
    answer,
    id: existingQuestionId ?? createId(),
    options,
    prompt,
    type: questionType,
  };
};

export const validateQuestionDraft = (
  draft: QuizQuestionDraft,
): QuestionDraftErrors => {
  const errors: QuestionDraftErrors = {};

  if (!draft.type) {
    errors.type = "Select a question type";
  }

  if (!draft.prompt.trim()) {
    errors.prompt = "Question is required";
  }

  if (draft.type === "fill_in_the_blank" && !draft.answer.trim()) {
    errors.answer = "Answer is required";
  }

  if (draft.type === "multiple_choice") {
    if (draft.options.length < MULTIPLE_CHOICE_MIN_OPTIONS) {
      errors.options = "Add at least 2 options";
      return errors;
    }

    if (draft.options.length > MULTIPLE_CHOICE_MAX_OPTIONS) {
      errors.options = "A maximum of 4 options is allowed";
      return errors;
    }

    const hasEmptyOption = draft.options.some((option) => !option.text.trim());
    if (hasEmptyOption) {
      errors.options = "Every option must have text";
      return errors;
    }

    const correctOptions = draft.options.filter((option) => option.isCorrect);
    if (correctOptions.length !== 1) {
      errors.options = "Select one correct answer";
    }
  }

  return errors;
};

export const getQuestionTypeLabel = (questionType: QuizQuestionType) => {
  if (questionType === "multiple_choice") {
    return "Multiple choice question";
  }

  return "Fill in the blank question";
};
