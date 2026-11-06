"use client";

import useProfileDetailsQuery from "@spt/hooks/apiRequests/useProfileDetailsQuery";
import { useAuthStore } from "@spt/store/authStore";

// The institution record's id (e.g. a lecturer's `institution_id`), not the
// institution user's id.
const readInstitutionId = (user: unknown): number | null => {
  const record = user as { institution?: { id?: unknown } | null; institution_id?: unknown } | null;
  const id = Number(record?.institution?.id ?? record?.institution_id);
  return Number.isFinite(id) && id > 0 ? id : null;
};

// The logged-in user is checked first; their profile fills in when the login
// payload doesn't carry it. `isResolved` turns true once there's an id or the
// profile has answered without one, so callers can wait for it.
const useInstitutionId = () => {
  const user = useAuthStore((state) => state.user);
  const fromUser = readInstitutionId(user);
  const profile = useProfileDetailsQuery();

  const institutionId = fromUser ?? readInstitutionId(profile.data?.data);

  return {
    institutionId,
    isResolved: institutionId != null || !user || profile.isSuccess || profile.isError,
  };
};

export default useInstitutionId;
