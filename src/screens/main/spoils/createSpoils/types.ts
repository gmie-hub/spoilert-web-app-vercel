export type SpoilTypeOption = "simple" | "advanced";

export type {
  Lesson,
  LessonTypeOption,
  Module,
  OutlineData,
  QuizConfig,
} from "@spt/types";

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
  is_active?: number | boolean;
  status?: number | boolean;
  // spoil type for simple vs advanced
  type?: SpoilTypeOption;
  // simple-spoil specific lesson fields (optional)
  lessonType?: "file" | "text";
  lessonContent?: string;
  lessonFile?: File | string | null;
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
