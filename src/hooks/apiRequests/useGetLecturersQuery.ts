"use client";

import { useQuery } from "@tanstack/react-query";

import type { InviteStatus, Lecturer } from "@spt/screens/institution/lecturers/constants";
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
  // Not returned by the API yet; every lecturer shows as Pending until it is.
  status?: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    avatar: string | null;
    last_login: string | null;
    total_spoils_created: number | null;
  } | null;
}

interface LecturersResponse {
  message: string;
  status: boolean;
  data: {
    current_page: number;
    data: ApiLecturer[];
    last_page: number;
    per_page: number;
    total: number;
  };
}

const toInviteStatus = (value?: string | null): InviteStatus => {
  switch (value?.toLowerCase()) {
    case "accepted":
    case "active":
      return "Accepted";
    case "declined":
    case "rejected":
      return "Declined";
    default:
      return "Pending";
  }
};

// Matches the DD-MM-YYYY format the table already uses.
const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("en-GB").split("/").join("-") : "-";

const toLecturer = (item: ApiLecturer): Lecturer => ({
  id: String(item.id),
  firstName: item.user?.first_name ?? "",
  lastName: item.user?.last_name ?? "",
  email: item.user?.email ?? "",
  phone: item.user?.phone_number ?? "",
  faculty: item.faculty ?? "",
  department: item.department ?? "",
  position: item.position ?? "",
  totalCourses: item.user?.total_spoils_created ?? 0,
  inviteStatus: toInviteStatus(item.status),
  dateSent: formatDate(item.created_at),
  lastLogin: formatDate(item.user?.last_login),
  metrics: {
    totalRevenueGenerated: "₦0",
    totalSpoylzCreated: item.user?.total_spoils_created ?? 0,
    studentsEnrolled: 0,
    institutionEarnings: "₦0",
    lecturerEarnings: "₦0",
  },
});

const useGetLecturersQuery = () => {
  const { data, isLoading, isError, error } = useQuery<
    LecturersResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["institution-lecturers"],
    queryFn: async () => (await api.get("/lecturers")).data,
  });

  return {
    lecturers: (data?.data?.data ?? []).map(toLecturer),
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch lecturers",
  };
};

export default useGetLecturersQuery;
