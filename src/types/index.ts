export interface Lesson {
  id: string;
  title: string;
  type: "video" | "pdf" | "text";
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
}

export interface QuizConfig {
  id: string;
  title: string;
  description: string;
}

export interface OutlineData {
  modules: Module[];
  preQuiz?: QuizConfig;
  postQuiz?: QuizConfig;
  spoil_id?: number | string;
}
