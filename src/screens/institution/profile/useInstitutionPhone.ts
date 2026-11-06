"use client";

import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useVerifyPhoneMutation } from "@spt/hooks/apiRequests/useVerifyPhoneMutation";
import { useAuthStore } from "@spt/store/authStore";

import type { ProfileChanges } from "./components/EditProfileModal";

export type ProfileUpdate = ProfileChanges & { phone_verified_at?: string };

// The dial code without "+", e.g. "234".
export const toCountryCode = (value?: string | number | null) =>
  String(value || "234").replace("+", "");

// Stored as typed at sign-up (e.g. 09012345678); shown and sent for OTP without the 0.
export const toOtpPhoneNumber = (value?: string | null) => String(value || "").replace(/^0/, "");

// Phone verification shared by the Profile page and the dashboard's KYC steps.
export const useInstitutionPhone = () => {
  const queryClient = useQueryClient();
  const { sendOtp, isLoading: isSendingOtp } = useVerifyPhoneMutation();

  // Show a change straight away — in the cached profile and the logged-in user
  // (which feeds the dashboard header) — while the profile refetch confirms it.
  const applyProfileChanges = (changes: ProfileUpdate) => {
    queryClient.setQueriesData({ queryKey: ["user-profile"] }, (old: any) =>
      old?.data ? { ...old, data: { ...old.data, ...changes } } : old,
    );

    const { user: currentUser, token } = useAuthStore.getState();
    if (currentUser && token) {
      useAuthStore.getState().setAuth({ user: { ...currentUser, ...changes }, token });
    }
  };

  const markPhoneVerified = () => {
    applyProfileChanges({ phone_verified_at: new Date().toISOString() });
    queryClient.invalidateQueries({ queryKey: ["user-profile"] });
  };

  // Resolves to true once the code is on its way.
  const sendPhoneOtp = async (countryCode: string, phoneNumber: string) => {
    if (isSendingOtp) return false;

    try {
      const response = await sendOtp({ country_code: countryCode, phone_number: phoneNumber });
      toast.success(response?.message || "OTP sent successfully 📲");
      return true;
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send OTP";

      // The backend already has this number down as verified — just sync the UI.
      if (message === "Phone already verified.") {
        toast.success(message);
        markPhoneVerified();
        return false;
      }
      toast.error(message);
      return false;
    }
  };

  return { applyProfileChanges, markPhoneVerified, sendPhoneOtp, isSendingOtp };
};
