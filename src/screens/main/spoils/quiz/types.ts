export type QuizQuestionType = "multiple_choice" | "fill_in_the_blank";

export interface QuizQuestionOption {
  id: string;
  isCorrect: boolean;
  text: string;
}

export interface QuizQuestion {
  answer: string;
  id: string;
  options: QuizQuestionOption[];
  prompt: string;
  type: QuizQuestionType;
}

export interface QuizQuestionDraft {
  answer: string;
  options: QuizQuestionOption[];
  prompt: string;
  type: QuizQuestionType | "";
}

export interface QuizOverviewDraft {
  title: string;
  description: string;
  numberOfQuestions: string;
  timeLimit: string;
  passmark?: string;
}
