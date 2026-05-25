"use client";

import useProfileDetailsQuery from "@spt/hooks/apiRequests/useProfileDetailsQuery";

export default function ManageBankAccount() {
  const { data, isLoading } = useProfileDetailsQuery();

  const bankAccount = data?.data?.bank_accounts?.[0];

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#20262D] mb-2">Manage Bank Accounts</h2>
      <p className="text-gray-500 mb-6">
        Use your bank account to make withdrawals. Contact customer support if you want to change your bank account
      </p>

      {isLoading && (
        <div className="h-24 w-full max-w-lg rounded-xl bg-gray-100 animate-pulse" />
      )}

      {!isLoading && !bankAccount && (
        <p className="text-sm text-gray-400">No bank account linked yet.</p>
      )}

      {!isLoading && bankAccount && (
        <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] flex items-center gap-4 p-6 w-full max-w-lg">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#E5E7EB]">
            <span className="text-lg font-bold text-[#20262D]">
              {bankAccount.bank_code}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-base text-[#20262D]">
              Bank Code: {bankAccount.bank_code}
            </span>
            <span className="font-mono text-lg tracking-widest text-[#20262D]">
              {bankAccount.account_number}
            </span>
            <span className="text-gray-500 text-sm mt-1">
              {bankAccount.account_name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
