"use client";

import { useState } from "react";

import { FiCheck, FiChevronLeft } from "react-icons/fi";
import { IoCopyOutline } from "react-icons/io5";

import useGetSponsorshipDetailsQuery from "@spt/hooks/apiRequests/useGetSponsorshipDetailsQuery";
import type { SponsorshipCode } from "@spt/hooks/apiRequests/useGetSponsorshipsQuery";

import { ErrorState } from "../../home/spoilDetails/spoilDetails";
import { LoadingState } from "../../spoil/preSpoilQuiz/components/LoadingState";

function CodeRow({ code, index }: { code: SponsorshipCode; index: number }) {
  const [copied, setCopied] = useState(false);
  const isUsed = code.redeemed_at !== null;

  function handleCopy() {
    navigator.clipboard.writeText(code.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[16px] text-[#495057]">
            📌Code {index + 1}:{" "}
            <span className=" text-[#212529]">{code.code}</span>
          </span>
        </div>
        {isUsed && (
          <>  <div className="ml-5 flex flex-col gap-0.5">
            <span className="text-[12px] text-[#666869]">
              Date By:{" "}
              <span className=" text-[#4D4B4B]">{code.redeemed_at}</span>
            </span>
          </div>
             <div className="ml-5 flex flex-col gap-0.5">
            <span className="text-[14px] text-[#666869]">
              Date Used:{" "}
              <span className="font-medium text-[#666869]">{code.redeemed_at}</span>
            </span>
          </div></>
       
        )}
      </div>

      {isUsed ? (
        <span className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-[#F3F4F6] px-4 py-2 text-[13px] font-medium text-[#9CA3AF]">
          <FiCheck className="h-[14px] w-[14px]" />
          Used
        </span>
      ) : (
        <button
          onClick={handleCopy}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-[#D4A437] px-4 py-2 text-[13px] font-medium text-[#D4A437] transition-colors hover:bg-[#FFF8EC]"
        >
          <IoCopyOutline className="h-[14px] w-[14px]" />
          {copied ? "Copied!" : "Copy"}
        </button>
      )}
    </div>
  );
}

interface SponsorshipDetailPageProps {
  id: number;
  onBack: () => void;
}

export default function SponsorshipDetailPage({ id, onBack }: SponsorshipDetailPageProps) {
  const { sponsorship, isLoading, isError, errorMessage } = useGetSponsorshipDetailsQuery(id);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={errorMessage} />;
  if (!sponsorship) return <ErrorState message="Sponsorship not found." />;

  const tutorName = sponsorship.spoil?.tutor
    ? `${sponsorship.spoil.tutor.first_name} ${sponsorship.spoil.tutor.last_name}`
    : "—";

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onBack}
        className="flex w-fit items-center gap-1 text-[13px] font-medium text-[#013B4D] hover:underline"
      >
        <FiChevronLeft className="h-4 w-4" />
        Back
      </button>

      <h2 className="text-[18px] font-semibold text-[#212529]">Sponsorship Details</h2>

      <div className="rounded-xl">
        {/* Spoil title */}
        <div className="px-5 py-4">
          <p className="text-[14px] text-[#666869]">Spoil Title</p>
          <p className="mt-0.5 text-[16px] font-semibold text-[#212529]">
            {sponsorship.spoil?.title ?? "—"}
          </p>
        </div>

        {/* Tutor · Learners · Codes used */}
        <div className="border-t border-[#EFEFEF] px-5 py-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Tutor's Name", value: tutorName },
              { label: "Learner's Sponsored", value: String(sponsorship.total_codes) },
              { label: "Code Used", value: String(sponsorship.total_redeemed) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[14px] text-[#6E6E6E]">{label}</p>
                <p className="mt-0.5 text-[16px] font-medium text-[#212529]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Amount · Date — same grid-cols-3, Date pinned to col 3 */}
        <div className="border-t border-[#EFEFEF] px-5 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-start-1">
              <p className="text-[14px] text-[#6E6E6E]">Amount Paid</p>
              <p className="mt-0.5 text-[16px] font-medium text-[#212529]">
                N{sponsorship.total_amount}
              </p>
            </div>
            <div className="col-start-3">
              <p className="text-[14px] text-[#6E6E6E]">Date Sponsored</p>
              <p className="mt-0.5 text-[16px] font-medium text-[#212529]">
                {sponsorship.paid_at ?? sponsorship.created_at ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Codes */}
      <div>
        <h3 className="mb-1 text-[18px] font-semibold text-[#212529]">Codes</h3>
        <div className="divide-y divide-[#EEF3F6] rounded-xl border border-[#EEF3F6] px-5">
          {sponsorship.codes.map((code, i) => (
            <CodeRow key={code.id} code={code} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
