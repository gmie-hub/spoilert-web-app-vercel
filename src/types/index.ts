export type LessonTypeOption = "video" | "pdf" | "text" | "file";

export interface Lesson {
  id: string;
  title: string;
  type: LessonTypeOption;
  content: string;
  file?: File | string | null;
  fileName?: string;
  description?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  /** Saved module quiz (overview + questions) once the tutor creates one. */
  quiz?: ModuleQuiz | null;
}

export interface QuizConfig {
  id: string;
  title: string;
  description: string;
}

export interface ModuleQuiz {
  id?: string;
  title?: string;
  description?: string;
  overview?: unknown;
  questions?: unknown[];
  passmark?: string | number;
  pass_mark?: string | number;
}

export interface OutlineData {
  modules: Module[];
  preQuiz?: QuizConfig;
  postQuiz?: QuizConfig;
  spoil_id?: number | string;
}