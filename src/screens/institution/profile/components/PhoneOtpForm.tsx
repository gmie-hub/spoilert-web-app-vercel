"use client";

import React, { useRef, useState } from "react";

import toast from "react-hot-toast";

import Button from "@spt/components/button";
import { usePhoneResendOtpMutation } from "@spt/hooks/apiRequests/usePhoneResendOtpMutation";
import { useVerifyOtpMutation } from "@spt/hooks/apiRequests/usePhoneVerifyOtpMutation";

// 6-digit phone OTP entry; authorised by the logged-in institution session.
const PhoneOtpForm = ({
  countryCode,
  phoneNumber,
  submitLabel = "Continue",
  onVerified,
}: {
  countryCode: string;
  phoneNumber: string;
  submitLabel?: string;
  onVerified: () => void;
}) => {
  const [code, setCode] = useState("");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const { verifyOtp, isLoading: isVerifying } = useVerifyOtpMutation();
  const { resendOtpForPhone, isLoading: isResending } = usePhoneResendOtpMutation();

  const handleVerify = async () => {
    if (code.length !== 6 || isVerifying) return;

    try {
      const response = await verifyOtp({ code });
      toast.success(response?.message || "Phone number verified successfully ✅");
      onVerified();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Invalid or expired code",
      );
    }
  };

  const handleResend = () => {
    if (isResending) return;
    resendOtpForPhone(countryCode, phoneNumber);
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "");
    if (!digit) return;

    const next = (code.padEnd(6, " ").substring(0, index) + digit + code.substring(index + 1))
      .replace(/\s/g, "")
      .slice(0, 6);
    setCode(next);
    if (index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const chars = code.padEnd(6, " ").split("");
      chars[index] = " ";
      setCode(chars.join("").replace(/\s/g, ""));
      if (index > 0) inputs.current[index - 1]?.focus();
    }
  };

  return (
    <>
      <div className="mt-8 flex justify-center gap-2 sm:gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[index] || ""}
            aria-label={`Digit ${index + 1}`}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-12 w-11 rounded-xl border border-gray-200 bg-[#FBFBFB] text-center text-lg font-semibold outline-none focus:border-[var(--color-blue)] sm:h-14 sm:w-12"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleResend}
        disabled={isResending}
        className="mx-auto mt-4 block text-center text-sm font-medium text-[var(--color-blue)] hover:underline disabled:opacity-50"
      >
        {isResending ? "Resending…" : "Resend Code"}
      </button>

      <Button
        type="button"
        className="mt-4 w-full disabled:opacity-50"
        disabled={code.length !== 6 || isVerifying}
        onClick={handleVerify}
      >
        {isVerifying ? "Verifying…" : submitLabel}
      </Button>
    </>
  );
};

export default PhoneOtpForm;
