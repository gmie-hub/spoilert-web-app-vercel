import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@spt/store/authStore";
import api from "@spt/utils/apiClient";

export const useProfileDetailsQuery = () => {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID not found");
      const { data } = await api.get(`/users/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};

export default useProfileDetailsQuery;
