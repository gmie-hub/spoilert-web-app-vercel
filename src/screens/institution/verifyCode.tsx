"use client";

import React from "react";

import { Form, Formik } from "formik";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import BackIcon from "@spt/assets/icons/arrow-left.svg";
import LogoMark from "@spt/assets/icons/Group(2).svg";
import Button from "@spt/components/button";
import Stack from "@spt/components/stack";
import { INSTITUTION_EMAIL_KEY } from "@spt/hooks/apiRequests/useInstitutionForgotPasswordMutation";
import { useInstitutionResendCodeMutation } from "@spt/hooks/apiRequests/useInstitutionResendCodeMutation";
import { useInstitutionVerifyCodeMutation } from "@spt/hooks/apiRequests/useInstitutionVerifyCodeMutation";

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const InstitutionVerifyCode = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [timer, setTimer] = React.useState(27);
  const otpInputs = React.useRef<(HTMLInputElement | null)[]>([]);

  const { verifyCodeHandler, isLoading } = useInstitutionVerifyCodeMutation();
  const { resendCodeHandler, isLoading: isResending } =
    useInstitutionResendCodeMutation();

  React.useEffect(() => {
    const storedEmail = localStorage.getItem(INSTITUTION_EMAIL_KEY) || "";
    if (!storedEmail) {
      router.replace("/institution/forgot-password");
      return;
    }
    setEmail(storedEmail);
    otpInputs.current[0]?.focus();
  }, [router]);

  React.useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendCode = async () => {
    await resendCodeHandler(email);
    setTimer(27);
  };

  const validationSchema = Yup.object().shape({
    code: Yup.string()
      .length(6, "Enter the 6-digit code")
      .required("Verification code is required"),
  });

  return (
    <main className="w-full max-w-none">
      <Stack className="w-full max-w-none space-y-8">
        <motion.div
          variants={childVariants}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-blue-lightest)]"
        >
          <Image src={LogoMark} alt="" width={24} height={18} />
        </motion.div>

        <motion.div
          onClick={router.back}
          variants={childVariants}
          className="flex w-full cursor-pointer justify-start"
          whileHover={{ scale: 1.05 }}
        >
          <Image src={BackIcon} alt="Back" width={20} height={20} />
        </motion.div>

        <div className="space-y-2 w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
            Verify Code
          </h1>
          <p className="text-sm sm:text-md text-gray-500 max-w-md">
            We&rsquo;ve sent a six digit code to{" "}
            <span className="font-medium text-gray-700">{email}</span>. Enter
            the code to reset your password.
          </p>
        </div>

        <Formik
          initialValues={{ code: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) =>
            verifyCodeHandler(values.code, actions)
          }
        >
          {({
            values,
            setFieldValue,
            errors,
            touched,
            setFieldTouched,
            isValid,
          }) => (
            <Form className="space-y-6 w-full max-w-none">
              <div className="flex justify-start gap-2 sm:gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputs.current[index] = el;
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
                      setFieldTouched("code", true, true);

                      if (index < 5) otpInputs.current[index + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        e.preventDefault();
                        const newArr = values.code
                          .split("")
                          .map((c) => c || "");
                        newArr[index] = "";
                        setFieldValue("code", newArr.join(""));
                        if (index > 0) otpInputs.current[index - 1]?.focus();
                      }
                      if (e.key === "ArrowLeft" && index > 0) {
                        otpInputs.current[index - 1]?.focus();
                      }
                      if (e.key === "ArrowRight" && index < 5) {
                        otpInputs.current[index + 1]?.focus();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const paste = e.clipboardData
                        .getData("Text")
                        .replace(/\D/g, "");
                      if (!paste) return;
                      const arr = Array.from(values.code.padEnd(6, " "));
                      for (let i = 0; i < 6 && i < paste.length; i++) {
                        arr[i] = paste[i];
                      }
                      const newCode = arr.join("").trim();
                      setFieldValue("code", newCode);
                      setFieldTouched("code", true, true);
                      const last = Math.min(paste.length - 1, 5);
                      otpInputs.current[last]?.focus();
                    }}
                    className="w-14 h-10 sm:w-14 sm:h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ))}
              </div>
              {errors.code && touched.code && (
                <p className="text-red-500 text-sm">{errors.code}</p>
              )}

              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </Form>
          )}
        </Formik>

        <p className="text-sm text-center text-gray-500">
          Didn&rsquo;t get code?{" "}
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
              onClick={handleResendCode}
              disabled={isResending}
              className="underline text-[#DA8543] hover:opacity-80 disabled:opacity-50"
            >
              {isResending ? "Resending..." : "Resend Code"}
            </button>
          )}
        </p>
      </Stack>
    </main>
  );
};

export default InstitutionVerifyCode;
