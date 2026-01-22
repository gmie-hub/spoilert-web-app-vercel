"use client";

import { useEffect, useRef, useState } from "react";

import { Form, Formik } from "formik";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import NewMessageIcon from "@spt/assets/icons/New message-rafiki 1.svg";
import Button from "@spt/components/button";
import { childVariants } from "@spt/components/successState";
import { useResendOtpMutation } from "@spt/hooks/apiRequests/resendOtpMutation";
import { useVerifyEmailMutation } from "@spt/hooks/apiRequests/useVerifyEmailMutation"; // import your verify email hook

const VerifyEmail = () => {
  const [timer, setTimer] = useState(27);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const email = localStorage.getItem("userEmail") || "";
  const router = useRouter();

  const { resendOtpHandler, isLoading } = useResendOtpMutation();
  const { verifyEmailHandler, isLoading: verifying } = useVerifyEmailMutation();

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Auto focus first OTP input
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const validationSchema = Yup.object({
    code: Yup.string()
      .length(6, "Enter the 6-digit code")
      .required("Verification code is required"),
  });

  const handleResendOtp = async () => {
    await resendOtpHandler(email);
    setTimer(27); // restart timer after resend
  };

  const handleClose = () => {
    router.push("/auth/signup");
  };

  return (
    <main className="w-full max-w-none">
      <div className="flex justify-end">
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-800 font-bold text-xl"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Illustration */}
      <motion.div
        variants={childVariants}
        className="flex justify-center items-center w-full"
        whileHover={{ scale: 1.05 }}
      >
        <Image
          src={NewMessageIcon}
          alt="global"
          width={200}
          height={36}
          className="md:w-[200px] md:h-[200px]"
        />
      </motion.div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          Verify Your Email Address
        </h1>
        <p className="text-sm text-gray-500">
          A six digit code has been sent to{" "}
          <span className="font-medium text-gray-700">{email}</span>. Enter the
          code to verify your email address.
        </p>
      </div>

      {/* Form */}
      <Formik
        initialValues={{ code: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          // call verify email mutation
          verifyEmailHandler({ email, code: values.code }, actions);
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Inputs */}
            <div className="flex justify-between gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={values.code[index] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (!val) return;

                    const newCode =
                      values.code.substring(0, index) +
                      val +
                      values.code.substring(index + 1);

                    setFieldValue("code", newCode);

                    if (index < 5) inputsRef.current[index + 1]?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      !values.code[index] &&
                      index > 0
                    ) {
                      inputsRef.current[index - 1]?.focus();
                    }
                  }}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button type="submit" className="w-full" disabled={verifying}>
              {verifying ? "Verifying..." : "Verify"}
            </Button>
          </Form>
        )}
      </Formik>

      {/* Resend */}
      <p className="text-sm text-center text-gray-500 pt-5">
        Didn’t get code?{" "}
        {timer > 0 ? (
          <span>
            can resend in{" "}
            <span className="text-primary font-medium">
              00:{timer.toString().padStart(2, "0")}
            </span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isLoading}
            className="underline cursor-pointer text-[var(--color-blue)] hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Resending..." : "Resend Code"}
          </button>
        )}
      </p>
    </main>
  );
};

export default VerifyEmail;
