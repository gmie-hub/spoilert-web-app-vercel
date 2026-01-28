"use client";

import { ReactNode, useEffect, useRef } from "react";

import { Form, Formik } from "formik";
import { motion } from "framer-motion";
import Image from "next/image";
import * as Yup from "yup";

import Button from "@spt/components/button";
import { childVariants } from "@spt/components/successState";

interface OtpVerificationLayoutProps {
  title: string;

  /** Optional description block */
  description?: ReactNode;

  /** Optional top icon */
  icon?: string;

  /** Button label */
  buttonLabel: string;

  /** Button submit handler */
  onSubmit: (code: string, actions: any) => void;

  /** Disable button (loading state) */
  isSubmitting?: boolean;
}

const OtpVerificationLayout = ({
  title,
  description,
  icon,
  buttonLabel,
  onSubmit,
  isSubmitting = false,
}: OtpVerificationLayoutProps) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const validationSchema = Yup.object({
    code: Yup.string()
      .length(6, "Enter the 6-digit code")
      .required("Verification code is required"),
  });

  return (
    <div className="max-w-md mx-auto">
      {/* Icon */}
      {icon && (
        <motion.div
          variants={childVariants}
          className="flex justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <Image
            src={icon}
            alt="verification icon"
            width={200}
            height={200}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
          />
        </motion.div>
      )}

      {/* Header */}
      <div className="text-center space-y-2 mt-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          {title}
        </h1>

        {description && (
          <div className="text-sm text-gray-500">{description}</div>
        )}
      </div>

      {/* Form */}
      <Formik
        initialValues={{ code: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) =>
          onSubmit(values.code, actions)
        }
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* OTP inputs */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                   ref={(el) => {
                     inputsRef.current[index] = el;
                   }}                  type="text"
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
                    if (index < 5)
                      inputsRef.current[index + 1]?.focus();
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
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ))}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : buttonLabel}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OtpVerificationLayout;
