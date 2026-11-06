"use client";

import { useQuery } from "@tanstack/react-query";

import useInstitutionId from "@spt/hooks/useInstitutionId";
import type { InviteStatus, Lecturer } from "@spt/screens/institution/lecturers/types";
import { formatDate } from "@spt/screens/institution/lecturers/utils";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

// The lecturer's personal details live on the nested `user`.
export interface ApiLecturer {
  id: number;
  user_id: number;
  institution_id: number;
  faculty: string | null;
  department: string | null;
  position: string | null;
  created_at: string;
  updated_at: string;
  // False until the lecturer accepts the invitation and finishes onboarding.
  completed_onboarding: boolean | null;
  user: {
    id: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    avatar: string | null;
    last_login: string | null;
    total_spoils_created: number | null;
    // The bio sits on the tutor profile, as on the users /spoils returns.
    profile?: { bio: string | null } | null;
  } | null;
}

interface LecturersPage {
  current_page: number;
  data: ApiLecturer[];
  last_page: number;
  per_page: number;
  total: number;
}

interface LecturersResponse {
  message: string;
  status: boolean;
  data: LecturersPage;
}

// The invitation is pending until the lecturer completes onboarding. Without a
// user there's no email to resend it to, so no status is shown. The API has no
// way to say an invitation was declined.
const toInviteStatus = (item: ApiLecturer): InviteStatus | null => {
  if (!item.user || item.completed_onboarding == null) return null;
  return item.completed_onboarding ? "Accepted" : "Pending";
};

const toLecturer = (item: ApiLecturer): Lecturer => ({
  id: String(item.id),
  userId: item.user_id,
  firstName: item.user?.first_name ?? "",
  lastName: item.user?.last_name ?? "",
  email: item.user?.email ?? "",
  phone: item.user?.phone_number ?? "",
  avatar: item.user?.avatar ?? null,
  faculty: item.faculty ?? "",
  department: item.department ?? "",
  position: item.position ?? "",
  totalCourses: item.user?.total_spoils_created ?? 0,
  inviteStatus: toInviteStatus(item),
  dateSent: formatDate(item.created_at),
  lastLogin: formatDate(item.user?.last_login),
  bio: item.user?.profile?.bio || null,
});

// Every page is pulled anyway, so a large page keeps the request count down.
const LECTURERS_PER_PAGE = 100;

const fetchLecturersPage = async (page: number, institutionId: number | null) =>
  (
    await api.get<LecturersResponse>("/lecturers", {
      params: {
        page,
        per_page: LECTURERS_PER_PAGE,
        // Left out when the institution's id can't be found, so the list still loads.
        ...(institutionId != null && { institution_id: institutionId }),
      },
    })
  ).data.data;

const useGetLecturersQuery = () => {
  const { institutionId, isResolved } = useInstitutionId();

  const { data, isLoading, isError, error } = useQuery<
    ApiLecturer[],
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["institution-lecturers", institutionId, LECTURERS_PER_PAGE],
    // The endpoint is paginated, so pull every page: search, the metrics and the
    // details page all need the whole list.
    queryFn: async () => {
      const firstPage = await fetchLecturersPage(1, institutionId);
      const otherPages = await Promise.all(
        Array.from({ length: Math.max(0, firstPage.last_page - 1) }, (_, index) =>
          fetchLecturersPage(index + 2, institutionId),
        ),
      );
      return [firstPage, ...otherPages].flatMap((page) => page.data ?? []);
    },
    // Waits for the institution's id so the list isn't fetched twice.
    enabled: isResolved,
  });

  const lecturers = (data ?? []).map(toLecturer);

  return {
    lecturers,
    total: lecturers.length,
    // Still loading while the institution's id is being looked up.
    isLoading: isLoading || !isResolved,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch lecturers",
  };
};

export default useGetLecturersQuery;
