"use client";
import React from "react";
import { useState } from "react";

import { FiCheck, FiCopy, FiMail, FiPhone } from "react-icons/fi";

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#EEF3F6] bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#EEF3F6]">
        <Icon className="h-5 w-5 text-[#0B5368]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-[#6B7B8D]">{label}</p>
        <p className="mt-0.5 text-[14px] font-semibold text-[#20262D] truncate">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className={`flex flex-shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
          copied
            ? "bg-green-50 text-green-600"
            : "bg-[#EEF3F6] text-[#0B5368] hover:bg-[#D6EEF5]"
        }`}
      >
        {copied ? (
          <>
            <FiCheck className="h-3.5 w-3.5" />
            Copied
          </>
        ) : (
          <>
            <FiCopy className="h-3.5 w-3.5" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}




export default function CustomerSupportPage() {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[20px] font-semibold text-[#20262D]">
        Customer Support
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard icon={FiMail} label="Email" value="thespoilert@gmail.com" />
        <InfoCard
          icon={FiPhone}
          label="Phone Number"
          value="+234 91 59894123"
        />
      </div>
    </div>
  );
}
