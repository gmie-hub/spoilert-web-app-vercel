"use client";


import Image from "next/image";

import firstBankLogo from "@spt/assets/images/app-store.png";

export default function ManageBankAccount() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#20262D] mb-2">Manage Bank Accounts</h2>
      <p className="text-gray-500 mb-6">
        Use your bank account to make withdrawals. Contact customer support if you want to change your bank account
      </p>
      <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] flex items-center gap-4 p-6 w-full max-w-lg">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#E5E7EB]">
          <Image src={firstBankLogo} alt="First Bank Logo" width={40} height={40} />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-base text-[#20262D]">First Bank Nigeria</span>
          <span className="font-mono text-lg tracking-widest text-[#20262D]">0123456789</span>
          <span className="text-gray-500 text-sm mt-1">Ogunsola Omorinsola</span>
        </div>
      </div>
    </div>
  );
}
