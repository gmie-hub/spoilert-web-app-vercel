import { useMutation } from "@tanstack/react-query";
import api from "@spt/utils/apiClient";
import { useAuthStore } from "@spt/store/authStore";

export const useDeleteUserMutation = () => {
  const logout = useAuthStore((state) => state.logout);
  return useMutation({
    mutationFn: async (userId: number) => {
      return (await api.delete(`/users/${0}`)).data;
    },
    onSuccess: () => {
      logout();
    },
  });
};

export default useDeleteUserMutation;
