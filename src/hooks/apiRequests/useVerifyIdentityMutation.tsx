// "use client";

// import { useMutation } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import api from "@spt/utils/apiClient";

// import type { AxiosError } from "axios";

// interface VerificationPayload {
//   type: string;
//   image: File;
// }

// interface VerificationResponse {
//   message: string;
//   data?: any;
// }

// export const useVerifyIdentityMutation = () => {
//   const mutation = useMutation<
//     VerificationResponse,
//     AxiosError,
//     VerificationPayload
//   >({
//     mutationKey: ["verify-identity"],
//     mutationFn: async (payload: VerificationPayload) => {
//       const formData = new FormData();
//       formData.append("type", payload.type);
//       formData.append("image", payload.image);

//       return (await api.post("/verifications", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })).data;
//     },
//   });

//   const verifyIdentityHandler = async (
//     payload: VerificationPayload,
//     setSubmitting: (isSubmitting: boolean) => void
//   ) => {
//     try {
//       const res = await mutation.mutateAsync(payload);
//       toast.success(res.message || "Verification successful ✅");
//       return res;
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message || error?.message || "Verification failed ❌"
//       );
//       throw error;
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return { verifyIdentityHandler, isLoading: mutation.isPending };
// };
"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface VerificationPayload {
  image: File; // 👈 only send image now
}

interface VerificationResponse {
  message: string;
  data?: any;
}

export const useVerifyIdentityMutation = () => {
  const mutation = useMutation<
    VerificationResponse,
    AxiosError,
    VerificationPayload
  >({
    mutationKey: ["verify-identity"],
    mutationFn: async ({ image }: VerificationPayload) => {
      const country = localStorage.getItem("selectedCountry");

      const type = country === "NG" ? "nin" : "id"; // 👈 auto logic

      const formData = new FormData();
      formData.append("type", type);
      formData.append("image", image);

      return (
        await api.post("/verifications", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    },
  });

  const verifyIdentityHandler = async (
    payload: VerificationPayload,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    try {
      const res = await mutation.mutateAsync(payload);
      toast.success(res.message || "Verification successful ✅");
      return res;
    } catch (error: any) {
      toast.error(     error?.response?.data?.error ||
        error?.response?.data?.message ||
          error?.message ||
          "Verification failed ❌"
      );
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return { verifyIdentityHandler, isLoading: mutation.isPending };
};
