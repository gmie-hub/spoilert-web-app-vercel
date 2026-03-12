"use client";

import React from "react";

import { Form, Formik } from "formik";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import BackIcon from "@spt/assets/icons/arrow-left.svg";
import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Stack from "@spt/components/stack";
import { useResetPasswordMutation } from "@spt/hooks/apiRequests/useResetPasswordMutation";
import { validations } from "@spt/utils/validation";

const ResetPassword = () => {
  const router = useRouter();
  const { resetPasswordHandler, isLoading } = useResetPasswordMutation();
  const otpInputs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    otpInputs.current[0]?.focus();
  }, []);

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .length(6, "Enter the 6-digit code")
      .required("OTP is required"),
    password: validations.password,
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Please re-enter your password"),
  });

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="w-full px-4 sm:px-8 md:px-16">
      <Stack className="w-full max-w-none space-y-8">
        {/* Header */}
        <motion.div
          onClick={router.back}
          variants={childVariants}
          className="flex justify-right  w-full cursor-pointer" 
          whileHover={{ scale: 1.05 }}
        >
          <Image src={BackIcon} alt=" " width={24} height={24} />
          <span>Back</span>
        </motion.div>

        <div className="space-y-2 w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
            Reset Password
          </h1>
          <p className="text-sm sm:text-md text-gray-500">
            Kindly create a new password
          </p>
        </div>

        {/* Form */}
        <Formik
          initialValues={{
            otp: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => resetPasswordHandler(values, actions)}
        >
          {({ values, setFieldValue, errors, touched, setFieldTouched, isValid }) => (
            <Form className="space-y-6 w-full max-w-none">
              {/* OTP boxes similar to verifyEmail layout */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP
                </label>
                <div className="flex justify-start gap-2 sm:gap-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={values.otp[index] || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (!val) return;

                        const newCode =
                          values.otp.substring(0, index) +
                          val +
                          values.otp.substring(index + 1);

                        setFieldValue("otp", newCode);
                        setFieldTouched("otp", true, true);

                        if (index < 5) otpInputs.current[index + 1]?.focus();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          e.preventDefault();
                          const newArr = values.otp
                            .split("")
                            .map((c) => c || "");
                          newArr[index] = "";
                          setFieldValue("otp", newArr.join(""));
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
                        const arr = Array.from(values.otp.padEnd(6, " "));
                        for (let i = 0; i < 6 && i < paste.length; i++) {
                          arr[i] = paste[i];
                        }
                        const newCode = arr.join("").trim();
                        setFieldValue("otp", newCode);
                        setFieldTouched("otp", true, true);
                        const last = Math.min(paste.length - 1, 5);
                        otpInputs.current[last]?.focus();
                      }}
                      ref={(el) => { otpInputs.current[index] = el; }}
                      className="w-14 h-10 sm:w-14 sm:h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ))}
                </div>
                {errors.otp && touched.otp && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {errors.otp}
                  </p>
                )}
              </div>


              

              {/* password fields follow */}
              <Input
                name="password"
                type="password"
                label="New Password"
                placeholder="Create your password"
              />

              <Input
                name="confirmPassword"
                type="password"
                label="Re-enter Password"
                placeholder="Re-enter your password"
              />

              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </Form>
          )}
        </Formik>
      </Stack>
    </main>
  );
};

export default ResetPassword;
