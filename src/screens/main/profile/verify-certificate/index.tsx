"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { FiArrowLeft, FiInfo } from "react-icons/fi";

import Button from "@spt/components/button";
import { useVerifyCertificateQuery } from "@spt/hooks/apiRequests/useVerifyCertificateQuery";

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function DetailCell({
  label,
  value,
  borderRight,
  borderBottom,
}: {
  label: string;
  value: string;
  borderRight?: boolean;
  borderBottom?: boolean;
}) {
  return (
    <div
      className={`px-5 py-4 ${borderRight ? "border-r border-[#EEF3F6]" : ""} ${borderBottom ? "border-b border-[#EEF3F6]" : ""}`}
    >
      <p className="text-[12px] text-[#6B7280] mb-1">{label}</p>
      <p className="text-[14px] font-semibold text-[#20262D]">{value}</p>
    </div>
  );
}

export default function VerifyCertificatePage({
  initialCertificateId,
}: {
  initialCertificateId?: string;
}) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(initialCertificateId ?? "");
  const [submittedId, setSubmittedId] = useState<string | null>(
    initialCertificateId ?? null,
  );

  const { data, isLoading, isError } = useVerifyCertificateQuery(submittedId);

  const handleVerify = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setSubmittedId(trimmed);
  };

  const handleRetry = () => {
    setSubmittedId(null);
    setInputValue("");
  };

  const hasSubmitted = !!submittedId;
  const isSuccess = hasSubmitted && !isLoading && !isError && !!data;
  const isNotFound = hasSubmitted && !isLoading && isError;

  if (isSuccess) {
    return (
      <div>
        <div className="lg:px-[100px] px-4 pt-6 pb-5">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-[#20262D] hover:opacity-70 transition-opacity mb-10"
          >
            <FiArrowLeft size={15} />
            Back
          </button>
        </div>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-4 py-10">
        <div className="w-full max-w-[600px] bg-white rounded-[24px] border border-[#EEF3F6] shadow-[0_18px_54px_rgba(11,83,104,0.08)] px-8 py-10">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M36 2L41.1 14.3L54.6 9.8L50.7 23.5L63.5 28.5L55.2 39.4L62.4 52.6L49 50.7L45.5 64L36 55.9L26.5 64L23 50.7L9.6 52.6L16.8 39.4L8.5 28.5L21.3 23.5L17.4 9.8L30.9 14.3Z"
                  fill="#28A745"
                />
                <path
                  d="M24 36L32 44L48 28"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-[20px] font-bold text-[#20262D] mb-1">
              This Certificate is Valid
            </h2>
            <p className="text-[14px] text-[#6B7280]">Issued by Spoilert</p>
          </div>

          <div className="rounded-xl border border-[#EEF3F6] overflow-hidden">
            <div className="grid grid-cols-2">
              <DetailCell
                label="Certificate Title"
                value={data.certificate_title}
                borderRight
                borderBottom
              />
              <DetailCell
                label="Certificate ID"
                value={data.certificate_id}
                borderBottom
              />
              <DetailCell
                label="Recipient Name"
                value={data.recipient_name}
                borderRight
                borderBottom
              />
              <DetailCell
                label="Spoylz Title"
                value={data.spoil_title}
                borderBottom
              />
              <DetailCell
                label="Tutor's Name"
                value={data.tutor_name}
                borderRight
              />
              <DetailCell
                label="Date Issued"
                value={formatDate(data.date_issued)}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div>
        <div className="lg:px-[100px] px-4 pt-6 pb-5">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-[#20262D] hover:opacity-70 transition-opacity mb-10"
          >
            <FiArrowLeft size={15} />
            Back
          </button>
        </div>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-4 py-10">
        <div className="w-full max-w-[550px] bg-white rounded-[24px] border border-[#EEF3F6] shadow-[0_18px_54px_rgba(11,83,104,0.08)] px-8 py-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full border-[3px] border-[#FFC107] flex items-center justify-center mb-5">
            <span
              className="text-[#FFC107] font-bold leading-none"
              style={{ fontSize: "28px" }}
            >
              !
            </span>
          </div>
          <h2 className="text-[20px] font-bold text-[#20262D] mb-2">
            Certificate Not Found
          </h2>
          <p className="text-[14px] text-[#6B7280] mb-8 max-w-[340px]">
            We couldn&apos;t find a certificate with this ID. Please check and
            try again.
          </p>
          <Button className="w-full" variant="darkBlue" onClick={handleRetry}>
            Retry Certificate Verification
          </Button>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div>
      <div className="lg:px-[100px] px-4 pt-6 pb-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-[#20262D] hover:opacity-70 transition-opacity mb-10"
        >
          <FiArrowLeft size={15} />
          Back
        </button>
      </div>
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-4 py-10">
      <div className="w-full max-w-[550px] bg-white rounded-[24px] border border-[#EEF3F6] shadow-[0_18px_54px_rgba(11,83,104,0.08)] px-8 py-10">
        <h2 className="text-[22px] font-bold text-[#20262D] mb-2">
          Verify Certificate
        </h2>
        <p className="text-[14px] text-[#6B7280] mb-7">
          Enter a certificate ID  to confirm its authenticity.
        </p>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="certificate-id"
            className="text-[14px] font-medium text-[#20262D]"
          >
            Certificate ID
          </label>
          <input
            id="certificate-id"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            placeholder="Enter the certificate ID"
            className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] text-[14px] text-[#20262D] placeholder:text-[#ADB5BD] focus:outline-none focus:border-[#013B4D] focus:ring-1 focus:ring-[#013B4D] transition-colors"
          />
          <p className="flex items-center gap-1.5 text-[12px] text-[#6B7280] mt-1">
            <FiInfo size={13} className="shrink-0" />
            You can find the certificate ID on the certificate document.
          </p>
        </div>

        <Button
          className="w-full mt-7"
          variant="darkBlue"
          onClick={handleVerify}
          // disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify Certificate"}
        </Button>
      </div>
    </div>
    </div>
  );
}
