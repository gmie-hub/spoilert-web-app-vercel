// import SuccessIcon from "@spt/assets/icons/question-chat-svgrepo-com 1.svg";
// import SuccessState from "@spt/components/successState";
// import { useAddBankAccountMutation } from "@spt/hooks/apiRequests/useAddBankAccMutation";

// const SureToSaveBankAccount = () => {
//    const { addBankAccountHandler, isLoading: isAdding } =
//       useAddBankAccountMutation();

//   return (
//     <div className="w-full flex justify-start">
//       <div className="w-[70%] space-y-4">
//         {" "}
//         <SuccessState
//           showBack
//           icon={SuccessIcon}
//           iconWidth={100}
//           iconHeight={100}
//           title="Are you sure you want to save this account?"
//           description="You can only link one bank account to your Spoilert profile. To change it later, please contact the admin."
//           buttonLabel="Save Bank Details"
//           href="/auth/signin"
//         />
//       </div>
//     </div>
//   );
// };

// export default SureToSaveBankAccount;
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

const SureToSaveBankAccount = () => {
  const { addBankAccountHandler, isLoading: isAdding } =
    useAddBankAccountMutation();

  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);

  // ✅ Load bankDetails object from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("bankDetails");
    if (stored) {
      setBankDetails(JSON.parse(stored));
    }
  }, []);

  // ✅ Final save
  const handleSaveBank = async () => {
    if (!bankDetails) return;

    try {
      await addBankAccountHandler(
        bankDetails.accountNumber,
        bankDetails.bankId,
      );


      // ✅ Clear localStorage after success
      localStorage.removeItem("bankDetails");

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save bank account",
      );
    }
  };

  return (
    <div className="w-full flex justify-start">
      <div className="w-[70%] space-y-4">
        <SuccessState
          showBack
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
