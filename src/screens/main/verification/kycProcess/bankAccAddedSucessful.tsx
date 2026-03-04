

import React from "react";

import { useRouter } from "next/navigation";

import SuccessIcon from "@spt/assets/icons/doneblue.svg";
import SuccessState from "@spt/components/successState";
import { useGetUserVerificationDetails } from "@spt/hooks/apiRequests/useGetUserVerificationDetailsQuery";
import { useAuthStore } from "@spt/store/authStore";

const BankAccAddedSucessful = ({ onShowKYCInProgress }: { onShowKYCInProgress: () => void }) => {
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);

  // call hook similarly to header to fetch latest verification details
  const { userVerificationDetails } = useGetUserVerificationDetails(authUser?.id || 0);

  const handleOk = async () => {
    // Immediately show KYCInProgress in parent
    if (onShowKYCInProgress) onShowKYCInProgress();
    try {
      const newStatus = userVerificationDetails?.data?.[0]?.status;
      if (authUser && newStatus !== undefined && authUser.verification_status !== newStatus) {
        const token = useAuthStore.getState().token ?? "";
        setAuth({ user: { ...authUser, verification_status: newStatus }, token });
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="w-full flex justify-start">
      <div className="w-[70%] space-y-4">
        <SuccessState
          icon={SuccessIcon}
          title="Bank Account Added Successfully 🎉 "
          buttonLabel="Okay"
          onButtonClick={handleOk}
        />
      </div>
    </div>
  );
};

export default BankAccAddedSucessful;
