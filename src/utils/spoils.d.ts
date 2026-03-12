export interface SpoilResponse {
  message: string;
  status: boolean;
  data: SpoilData;
}

export interface SpoilData {
  current_page: number;
  data: SpoilDatum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string;
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

export interface SpoilDatum {
  id: number;
  title: string;
  slug: string;
  category_id: null | number;
  tutor_id: number;
  description: string;
  cover_image_url: string;
  pricing: string;
  amount: null | number;
  institution: string;
  course_code: null;
  modules_no: number;
  lessons_no: number;
  what_to_tearn: string;
  is_active: number;
  status: number;
  is_draft: boolean;
  premiere_at: null;
  expires_at: string;
  is_institution: number;
  has_certificate: number;
  certificate_fee: string;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  display_amount: number;
  average_rating: number;
  ratings_count: number;
  enrolled_users: number;
  is_enrolled: boolean;
  likes_count: number;
  shares_count: number;
  is_liked_by_current_user: boolean;
  category: Category | null;
  tutor: Tutor;
}

export interface SpoilDetailsData {
  id: number;
  title: string;
  slug: string;
  type: string;
  category_id: number;
  tutor_id: number;
  description: string;
  cover_image_url: string;
  pricing: string;
  amount: null;
  institution: null;
  course_code: null;
  modules_no: number;
  lessons_no: number;
  what_to_learn: string;
  is_active: number;
  status: number;
  is_draft: boolean;
  premiere_at: null;
  expires_at: string;
  is_institution: number;
  has_certificate: number;
  certificate_fee: string;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  percentage_completed: number;
  total_modules_completed: number;
  total_modules_pending: number;
  current_module: string;
  current_lesson: string;
  learner_spoil: null;
  pre_spoil_quiz: Prespoilquiz;
  post_spoil_quiz: Prespoilquiz;
  module_spoil_quiz: Prespoilquiz;
  related_spoils: Relatedspoil[];
  display_amount: number;
  average_rating: number;
  ratings_count: number;
  enrolled_users: number;
  is_enrolled: boolean;
  likes_count: number;
  shares_count: number;
  is_liked_by_current_user: boolean;
  category: Category;
  tutor: Tutor;
  modules: Module[];
  quizzes: Quiz[];
}

interface Quiz {
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
  attempts: any[];
}

interface Module {
  id: number;
  title: string;
  slug: string;
  description: string;
  spoil_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  status: string;
  percentage_completed: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  slug: string;
  description: null;
  type: string;
  content: null;
  content_url: string;
  spoil_id: number;
  module_id: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  status: string;
}

interface Tutor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  avatar: string;
  profile: null;
  total_spoils_created: null;
  followers_count: null;
}

interface Relatedspoil {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  cover_image_url: string;
  description: string;
  amount: null;
  modules_no: number;
  lessons_no: number;
  display_amount: number;
  average_rating: number;
  ratings_count: number;
  enrolled_users: number;
  is_enrolled: boolean;
  likes_count: number;
  shares_count: number;
  is_liked_by_current_user: boolean;
  category: Category;
  tutor: null;
}

interface Category {
  id: number;
  name: string;
  description: null;
  url: string;
  total_spoils: number;
}

interface Prespoilquiz {
  highest_score: null;
  attempts: number;
}

interface Tutor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  avatar: null;
  profile: null;
  total_spoils_created: null;
  followers_count: null;
}

interface Category {
  id: number;
  name: string;
  description: null;
  url: string;
  total_spoils: number;
}

export interface CategoriesResponse {
  message: string;
  status: boolean;
  data: CategoriesData;
}

interface CategoriesData {
  current_page: number;
  data: CategoryDatum[];
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

export interface CategoryDatum {
  id: number;
  name: string;
  slug: string;
  description: null;
  url: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  total_spoils: number;
}