"use client";

import { useState } from "react";

import { useAddBankAccountMutation } from "@spt/hooks/apiRequests/useAddBankAccMutation";

import AddBankAccountForm, { type BankDetails } from "./AddBankAccountForm";
import ConfirmBankAccount from "./ConfirmBankAccount";
import ModalShell from "./ModalShell";

const AddBankAccountModal = ({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (details: BankDetails) => void;
}) => {
  // Set once the account name is verified; drives the confirm step.
  const [details, setDetails] = useState<BankDetails | null>(null);
  const { addBankAccountHandler, isLoading: isSaving } = useAddBankAccountMutation();

  const handleConfirm = async () => {
    if (!details || isSaving) return;
    const added = await addBankAccountHandler(details.accountNumber, details.bankId);
    if (added) onAdded(details);
  };

  return (
    <ModalShell
      title={details ? undefined : "Add Bank Account"}
      ariaLabel={details ? "Confirm bank account" : "Add bank account"}
      onClose={onClose}
    >
      {/* Kept mounted (just hidden) while confirming, so "Back" returns to the filled-in form. */}
      <div className={details ? "hidden" : ""}>
        <AddBankAccountForm onNext={setDetails} />
      </div>

      {details && (
        <ConfirmBankAccount
          details={details}
          isSaving={isSaving}
          onBack={() => setDetails(null)}
          onConfirm={handleConfirm}
        />
      )}
    </ModalShell>
  );
};

export default AddBankAccountModal;
