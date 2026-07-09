"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface RedeemSponsorshipPayload {
  code: string;
}

interface RedeemSponsorshipResponse {
  status?: boolean;
  message?: string;
  data?: any;
  [key: string]: any;
}

const useRedeemSponsorshipMutation = () => {
  const queryClient = useQueryClient();

  const redeemSponsorship = async (
    payload: RedeemSponsorshipPayload,
  ): Promise<RedeemSponsorshipResponse> => {
    return (await api.post("/sponsorships/users/redeem", payload)).data;
  };

  const mutation = useMutation<
    RedeemSponsorshipResponse,
    AxiosError<ApiErrorResponse>,
    RedeemSponsorshipPayload
  >({
    mutationKey: ["redeem-sponsorship"],
    mutationFn: redeemSponsorship,
  });

  const redeemSponsorshipHandler = async (code: string) => {
    // guard against submitting an empty/whitespace-only code
    const trimmedCode = code?.trim();
    if (!trimmedCode) {
      toast.error("Please enter a sponsorship code");
      return null;
    }

    try {
      const response = await mutation.mutateAsync({ code: trimmedCode });

      // redeeming enrolls the learner in the sponsored spoil, so refresh both
      // the sponsorship redeemed counts and the learner's learnings.
      try {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["sponsorships"] }),
          queryClient.invalidateQueries({ queryKey: ["learner-spoils"] }),
        ]);
      } catch (err) {
        // log and continue — invalidation failure shouldn't block the success path
        // eslint-disable-next-line no-console
        console.warn("Failed to invalidate queries after redeem", err);
      }

      toast.success(response?.message || "Sponsorship code redeemed successfully");

      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to redeem sponsorship code",
      );

      return null;
    }
  };

  return {
    redeemSponsorshipHandler,
    isLoading: mutation.isPending,
  };
};

export default useRedeemSponsorshipMutation;
