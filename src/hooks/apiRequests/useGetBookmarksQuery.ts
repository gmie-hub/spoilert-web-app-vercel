import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@spt/store/authStore";
import api from "@spt/utils/apiClient";


export const useGetBookmarksQuery = () => {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  const query = useQuery({
    queryKey: ["bookmarks", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID not found");
      const { data } = await api.get(`/bookmarks?user_id=${userId}`);
      return data;
    },
    enabled: !!userId,
  });

  return {
    ...query,
    isLoading: query.isLoading,
  };
};

