"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import NewMessageIcon from "@spt/assets/icons/New message-rafiki 1.svg";
import OtpVerificationLayout from "@spt/components/OtpVerificationLayout";
import { useResendOtpMutation } from "@spt/hooks/apiRequests/resendOtpMutation";
import { useVerifyEmailMutation } from "@spt/hooks/apiRequests/useVerifyEmailMutation";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [timer, setTimer] = useState(27);

  const { resendOtpHandler, isLoading } = useResendOtpMutation();
  const { verifyEmailHandler, isLoading: verifying } = useVerifyEmailMutation();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail") || "";
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleResendOtp = async () => {
    await resendOtpHandler(email);
    setTimer(27);
  };

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <main className="w-full px-4 sm:px-8 md:px-16">
      {/* Close */}
      <div className="flex justify-end max-w-md mx-auto">
        <button
          onClick={() => router.push("/auth/signup")}
          className="text-gray-500 hover:text-gray-800 font-bold text-xl"
        >
          ×
        </button>
      </div>

      <OtpVerificationLayout
        title="Verify Your Email Address"
        icon={NewMessageIcon}
        buttonLabel="Verify"
        isSubmitting={verifying}
        description={
          <>
            A six digit code has been sent to{" "}
            <span className="font-medium text-gray-700">{email}</span>. Enter
            the code to verify your email address.
          </>
        }
        onSubmit={(code, actions) =>
          verifyEmailHandler({ email, code }, actions)
        }
      />

      {/* Resend stays outside so it’s flexible */}
      <p className="text-sm text-center text-gray-500 pt-5">
        Didn’t get code?{" "}
        {timer > 0 ? (
          <span>
            can resend in{" "}
            <span className="text-primary font-medium text-[#EEB408]">
              00:{timer.toString().padStart(2, "0")}
            </span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isLoading}
            className="underline text-[#DA8543] hover:opacity-80 disabled:opacity-50"
          >
            {isLoading ? "Resending..." : "Resend Code"}
          </button>
        )}
      </p>
    </main>
  );
};

export default VerifyEmail;
