import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@spt/store/authStore";
import api from "@spt/utils/apiClient";

// The signed-in user's totals, or another learner's when given their id.
export const useGetLearnerOverviewQuery = (learnerId?: number | string) => {
  const user = useAuthStore((state) => state.user);
  const userId = learnerId ?? user?.id;

  const query = useQuery({
    queryKey: ["learner-overview", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID not found");
      const { data } = await api.get(`/spoils/learner/overview?user_id=${userId}`);
      return data?.data;
    },
    enabled: !!userId,
  });

  return {
    ...query,
    isLoading: query.isLoading,
  };
};
