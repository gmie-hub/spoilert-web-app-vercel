export interface QuizDetailsResponse {
  message: string;
  status: boolean;
  data: QuizDetailsData;
}

export interface QuizDetailsData {
  id: number;
  title: string;
  type: string;
  module_id: number;
  spoil_id: number;
  description: string;
  no_of_questions: number;
  time_limit: number;
  pass_mark: string;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  questions: Question[];
}

interface Question {
  id: number;
  quiz_id: number;
  type: string;
  question: string;
  options: null | string;
  answer: string;
  deleted_at: null;
  created_at: null;
  updated_at: null;
}

export interface QuizResponse {
  message: string;
  status: boolean;
  data: QuizData;
}

export interface QuizData {
  current_page: number;
  data: QuizDatum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: null;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

export interface QuizDatum {
  id: number;
  title: string;
  type: string;
  module_id: null;
  spoil_id: number;
  description: string;
  no_of_questions: number;
  time_limit: number;
  pass_mark: string;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}