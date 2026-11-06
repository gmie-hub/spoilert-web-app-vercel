"use client";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import SuccessIcon from "@spt/assets/icons/question-chat-svgrepo-com 1.svg";
import SuccessState from "@spt/components/successState";
import { useAddBankAccountMutation } from "@spt/hooks/apiRequests/useAddBankAccMutation";

interface BankDetails {
  accountNumber: string;
  bankId: number;
  bankName: string;
  accountName: string;
}

const SureToSaveBankAccount = ({
  onBack,
  onShowKYCInProgress,
}: {
  onBack?: () => void;
  onShowKYCInProgress: () => void;
}) => {
  const { addBankAccountHandler, isLoading: isAdding } =
    useAddBankAccountMutation();

  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("bankDetails");
    if (stored) {
      setBankDetails(JSON.parse(stored));
    }
  }, []);

  // Only moves on once POST banks/add succeeds; the parent then shows the
  // "Bank Account Added" screen. A failure is already toasted by the hook.
  const handleSaveBank = async () => {
    if (!bankDetails) {
      toast.error("Bank details not found. Please go back and verify your account again.");
      return;
    }

    const added = await addBankAccountHandler(
      bankDetails.accountNumber,
      bankDetails.bankId,
    );
    if (!added) return;

    localStorage.removeItem("bankDetails");
    onShowKYCInProgress();
  };

  return (
    <div className="w-full flex justify-start">
      <div className="w-[70%] space-y-4">
        <SuccessState
          showBack
          onBackClick={onBack}
          icon={SuccessIcon}
          iconWidth={100}
          iconHeight={100}
          title="Are you sure you want to save this account?"
          description="You can only link one bank account to your Spoilert profile. To change it later, please contact the admin."
          buttonLabel={isAdding ? "Saving..." : "Save Bank Details"}
          onButtonClick={handleSaveBank}
        />
      </div>
    </div>
  );
};

export default SureToSaveBankAccount;
