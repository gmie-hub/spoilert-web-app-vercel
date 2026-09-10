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
import Input from "@spt/components/input";
import Stack from "@spt/components/stack";
import { INSTITUTION_EMAIL_KEY } from "@spt/hooks/apiRequests/useInstitutionForgotPasswordMutation";
import { useInstitutionResetPasswordMutation } from "@spt/hooks/apiRequests/useInstitutionResetPasswordMutation";
import { validations } from "@spt/utils/validation";

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const InstitutionResetPassword = () => {
  const router = useRouter();
  const { resetPasswordHandler, isLoading } =
    useInstitutionResetPasswordMutation();

  React.useEffect(() => {
    if (!localStorage.getItem(INSTITUTION_EMAIL_KEY)) {
      router.replace("/institution/forgot-password");
    }
  }, [router]);

  const validationSchema = Yup.object().shape({
    password: validations.password,
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Please re-enter your password"),
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
            Reset Password
          </h1>
          <p className="text-sm sm:text-md text-gray-500">
            Kindly create a new password
          </p>
        </div>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => resetPasswordHandler(values, actions)}
        >
          {({ isValid }) => (
            <Form className="space-y-6 w-full max-w-none">
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

export default InstitutionResetPassword;
