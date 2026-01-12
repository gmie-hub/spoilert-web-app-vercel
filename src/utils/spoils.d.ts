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