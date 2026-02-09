// "use client";

// import { useMutation } from "@tanstack/react-query";
// import toast from "react-hot-toast";

// import { ApiErrorResponse } from "@spt/types/error";
// import api from "@spt/utils/apiClient";

// import type { AxiosError } from "axios";

// // Payload interface
// interface VerifyPhonePayload {
//   country_code: string;
//   phone_number: string;
// }

// // Response interface (adjust if your API returns more data)
// interface VerifyPhoneResponse {
//   message: string;
// }

// export const useVerifyPhoneMutation = () => {
//   const sendOtp = async (
//     payload: VerifyPhonePayload
//   ): Promise<VerifyPhoneResponse> => {
//     return (await api.post("users/phone/send-otp", payload)).data;
//   };

//   const mutation = useMutation<
//     VerifyPhoneResponse,
//     AxiosError<ApiErrorResponse>,
//     VerifyPhonePayload
//   >({
//     mutationKey: ["verify-phone"],
//     mutationFn: sendOtp,
//   });

//   const sendOtpHandler = async (country_code: string, phone_number: string) => {
//     try {
//       await mutation.mutateAsync({ country_code, phone_number });
//       toast.success("OTP sent successfully 📲");
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to send OTP"
//       );
//     }
//   };

//   return {
//     sendOtpHandler,
//     isLoading: mutation.isPending,
//   };
// };

"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";
import type { FormikValues } from "formik";

// Payload interface
interface VerifyPhonePayload {
  country_code: string;
  phone_number: string;
}

// Response interface (adjust if your API returns more data)
interface VerifyPhoneResponse {
  message: string;
}

export const useVerifyPhoneMutation = () => {
  const router = useRouter();

  const sendOtp = async (
    payload: VerifyPhonePayload,
  ): Promise<VerifyPhoneResponse> => {
    return (await api.post("users/phone/send-otp", payload)).data;
  };

  const mutation = useMutation<
    VerifyPhoneResponse,
    AxiosError<ApiErrorResponse>,
    VerifyPhonePayload
  >({
    mutationKey: ["verify-phone"],
    mutationFn: sendOtp,
  });

  const sendOtpHandler = async (
    values: FormikValues,
    { setSubmitting }: any,
  ) => {
    const payload: VerifyPhonePayload = {
      country_code: values.countryCode.replace("+", ""), // remove + for API
      phone_number: values.phoneNumber,
    };

    try {
      await mutation.mutateAsync(payload);
      toast.success("OTP sent successfully 📲");

      // optional: navigate to next step for OTP verification
      // router.push("/auth/phone-verification");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to send OTP",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isLoading: mutation.isPending,
    sendOtpHandler,
  };
};
