import type { UserDetails } from "@spt/hooks/apiRequests/useGetUserDetailsQuery";

import { formatDate } from "../../lecturers/utils";
import { NOT_AVAILABLE } from "../mappers";

// Text fields hold "-" when the API has nothing for them.
export interface LearnerProfileDetails {
  id: number;
  name: string;
  avatar: string | null;
  username: string;
  email: string;
  dateJoined: string;
  lastLogin: string;
  status: "Active" | "Inactive" | null;
}

export const toLearnerProfile = (user: UserDetails): LearnerProfileDetails => ({
  id: user.id,
  name:
    [user.first_name, user.middle_name, user.last_name]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(" ") || NOT_AVAILABLE,
  avatar: user.avatar || null,
  username: user.username || NOT_AVAILABLE,
  email: user.email || NOT_AVAILABLE,
  dateJoined: formatDate(user.created_at),
  lastLogin: formatDate(user.last_login),
  status: user.is_active == null ? null : Number(user.is_active) ? "Active" : "Inactive",
});
