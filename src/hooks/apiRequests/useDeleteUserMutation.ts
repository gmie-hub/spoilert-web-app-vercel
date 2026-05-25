import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@spt/store/authStore";
import api from "@spt/utils/apiClient";

export const useDeleteUserMutation = () => {
  const logout = useAuthStore((state) => state.logout);
  return useMutation({
    mutationFn: async (userId: number) => {
      return (await api.delete(`/users/${userId}`)).data;
    },
    onSuccess: () => {
      logout();
    },
  });
};

export default useDeleteUserMutation;
