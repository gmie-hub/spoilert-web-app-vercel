export type SpoilTypeOption = "simple" | "advanced";

export type CoverImagePersisted = { dataUrl: string; name: string; type: string };

export interface BasicsFormData {
  coverImage?: File | CoverImagePersisted | string | null;
  title: string;
  category: string;
  institution: string;
  courseCode: string;
  pricing: string;
  amount: string;
  expiryDate: string;
  moduleCount: string;
  lessonCount: string;
  description: string;
  learningOutcome: string;
  // optional scheduled premiere fields
  scheduledDate?: string;
  scheduledTime?: string;
  // draft flag: 1 = draft, 0 = published
  is_draft?: number | boolean;
  // spoil type for simple vs advanced
  type?: SpoilTypeOption;
  // simple-spoil specific lesson fields (optional)
  lessonType?: "file" | "text";
  lessonContent?: string;
  lessonFile?: File | string | null;
}

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
  /** optional server spoil id (set after creating spoil on server) */
  spoil_id?: number | string;
}


// moduleInterface

export interface Modules {
  id: number;
  title: string;
  slug: string;
  description: string;
  spoil_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ModulesPagination {
  current_page: number;
  data: Modules[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ModulesResponse {
  message: string;
  status: boolean;
  data: ModulesPagination;
}
