// "use client";

// import { useMutation } from "@tanstack/react-query";
// import toast from "react-hot-toast";

// import { ApiErrorResponse } from "@spt/types/error";
// import api from "@spt/utils/apiClient";

// import type { AxiosError } from "axios";
// import type { FormikValues } from "formik";

// // Payload interface
// interface ResendOtpPayload {
//   country_code: string;
//   phone_number: string;
// }

// // Response interface (adjust if your API returns more data)
// interface ResendOtpResponse {
//   message: string;
// }

// export const usePhoneResendOtpMutation = () => {
//   const resendOtp = async (
//     payload: ResendOtpPayload,
//   ): Promise<ResendOtpResponse> => {
//     return (await api.post("users/phone/resend-otp", payload)).data;
//   };

//   const mutation = useMutation<
//     ResendOtpResponse,
//     AxiosError<ApiErrorResponse>,
//     ResendOtpPayload
//   >({
//     mutationKey: ["resend-otp"],
//     mutationFn: resendOtp,
//   });

//   const resendOtpHandler = async (
//     values: FormikValues,
//     { setSubmitting }: any,
//   ) => {
//     const payload: ResendOtpPayload = {
//       country_code: values.countryCode.replace("+", ""), // e.g., "234"
//       phone_number: values.phoneNumber,
//     };

//     try {
//       await mutation.mutateAsync(payload);
//       toast.success("OTP resent successfully 📲");
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.error ||
//           error?.response?.data?.message ||
//           error?.message ||
//           "Failed to resend OTP",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return {
//     resendOtpHandler,
//     isLoading: mutation.isPending,
//   };
// };
"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

// Payload interface
interface ResendOtpPayload {
  country_code: string;
  phone_number: string;
}

// Response interface
interface ResendOtpResponse {
  message: string;
}

export const usePhoneResendOtpMutation = () => {
  const resendOtp = async (
    payload: ResendOtpPayload,
  ): Promise<ResendOtpResponse> => {
    return (await api.post("users/phone/resend-otp", payload)).data;
  };

  const mutation = useMutation<
    ResendOtpResponse,
    AxiosError<ApiErrorResponse>,
    ResendOtpPayload
  >({
    mutationKey: ["resend-otp"],
    mutationFn: resendOtp,
  });

  // ✅ Handler now uses localStorage values instead of form values
  const resendOtpHandler = async ({ setSubmitting }: any) => {
    // ✅ Get saved values
    const savedCountryCode = localStorage.getItem("countryCode");
    const savedPhoneNumber = localStorage.getItem("phoneNumber");

    // 🚨 Safety check
    if (!savedCountryCode || !savedPhoneNumber) {
      toast.error("Phone number not found. Please verify again.");
      setSubmitting(false);
      return;
    }

    // ✅ Build payload from localStorage
    const payload: ResendOtpPayload = {
      country_code: savedCountryCode.replace("+", ""), // e.g. "234"
      phone_number: savedPhoneNumber,
    };

    try {
      const response = await mutation.mutateAsync(payload);

      toast.success(response?.message || "OTP resent successfully 📲");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to resend OTP",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    resendOtpHandler,
    isLoading: mutation.isPending,
  };
};
