import Image from "next/image";

import QuestionIcon from "@spt/assets/icons/question-chat-svgrepo-com 1.svg";
import Button from "@spt/components/button";

import type { BankDetails } from "./AddBankAccountForm";

const ConfirmBankAccount = ({
  details,
  isSaving,
  onBack,
  onConfirm,
}: {
  details: BankDetails;
  isSaving: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) => (
  <div className="text-center">
    <Image src={QuestionIcon} alt="" width={100} height={100} className="mx-auto" />

    <h2 className="mt-5 text-xl font-semibold text-[#212529] sm:text-2xl">
      Are you sure you want to save this account?
    </h2>
    <p className="mt-2 text-sm text-gray-500">
      You can only link one bank account to your Institution account on
      Spoilert. To change it later, please contact the admin.
    </p>

    <dl className="mt-6 rounded-xl border border-gray-100 bg-[#FBFBFB] px-4 text-left">
      {[
        { label: "Bank Name", value: details.bankName },
        { label: "Account Number", value: details.accountNumber },
        { label: "Account Name", value: details.accountName },
      ].map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-4 border-b border-gray-100 py-3 last:border-0"
        >
          <dt className="shrink-0 text-sm text-gray-400">{row.label}</dt>
          <dd className="min-w-0 truncate text-right text-sm font-medium text-[#212529]">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>

    <div className="mt-7 flex gap-4">
      <Button
        type="button"
        variant="blueOutline"
        className="flex-1 disabled:opacity-50"
        disabled={isSaving}
        onClick={onBack}
      >
        Back
      </Button>
      <Button type="button" className="flex-1 disabled:opacity-50" disabled={isSaving} onClick={onConfirm}>
        {isSaving ? "Saving..." : "Save Bank Details"}
      </Button>
    </div>
  </div>
);

export default ConfirmBankAccount;
