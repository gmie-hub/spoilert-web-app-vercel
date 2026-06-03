import type { QuizDatum, QuizDetailsData } from "@spt/types/quiz";

export type QuizStage = "intro" | "quiz" | "completed";

export type QuestionType = "multiple_choice" | "fill_in_blank";

export interface NormalizedQuestion {
  id: number;
  answer: string;
  options: string[];
  prompt: string;
  type: QuestionType;
}

export type QuizQuestion = QuizDetailsData["questions"][number];

export const getPreSpoilQuiz = ({
  quizData,
  spoilQuizzes,
}: {
  quizData?: QuizDatum[];
  spoilQuizzes?: QuizDatum[];
}) =>
  quizData?.find((quiz) => quiz.type?.toLowerCase() === "pre") ??
  spoilQuizzes?.find((quiz) => quiz.type?.toLowerCase() === "pre") ??
  null;

export const getSpoilQuizByType = ({
  quizData,
  spoilQuizzes,
  type = "pre",
  moduleId,
}: {
  quizData?: QuizDatum[];
  spoilQuizzes?: QuizDatum[];
  type?: string;
  moduleId?: number | string | null;
}) => {
  const wanted = String(type ?? "pre").toLowerCase();

  const matches = (quiz: QuizDatum) => {
    if (quiz.type?.toLowerCase() !== wanted) return false;

    // Module quizzes are keyed by module — match the requested module only.
    if (moduleId != null) {
      return (
        Number((quiz as { module_id?: number | null }).module_id) ===
        Number(moduleId)
      );
    }

    return true;
  };

  return quizData?.find(matches) ?? spoilQuizzes?.find(matches) ?? null;
};

export const normalizeQuestions = (
  questions: QuizDetailsData["questions"] | undefined,
): NormalizedQuestion[] =>
  (questions ?? []).map((question: QuizQuestion) => ({
    id: question.id,
    answer: question.answer ?? "",
    options: parseQuestionOptions(question.options),
    prompt: question.question,
    type: parseQuestionType(question.type),
  }));

export const parseQuestionType = (value?: string | null): QuestionType =>
  value?.toLowerCase() === "fill_in_blank"
    ? "fill_in_blank"
    : "multiple_choice";

export const parseQuestionOptions = (value?: string | null) => {
  if (!value) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(value) as unknown;

    if (Array.isArray(parsedValue)) {
      return parsedValue
        .map((option) => String(option).trim())
        .filter(Boolean);
    }
  } catch {
    // Fall back to text parsing when the API value is not valid JSON.
  }

  return value
    .split(/\r?\n|\s*\|\s*|,\s*/)
    .map((option) => option.trim())
    .filter(Boolean);
};

export const formatTimer = (totalSeconds: number | null) => {
  if (totalSeconds === null) {
    return "--:--";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const normalizeAnswer = (value?: string | null) =>
  value?.trim().toLowerCase() ?? "";

export const getQuestionStatus = ({
  hasAnswer,
  index,
  isVisited,
  currentIndex,
}: {
  hasAnswer: boolean;
  index: number;
  isVisited: boolean;
  currentIndex: number;
}) => {
  if (index === currentIndex) {
    return "active";
  }

  if (hasAnswer || isVisited) {
    return "visited";
  }

  return "upcoming";
};
