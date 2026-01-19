"use client";

import { Form, Formik } from "formik";
import { useSearchParams } from "next/navigation";
import * as Yup from "yup";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Stack from "@spt/components/stack";
import { useResetPasswordMutation } from
  "@spt/hooks/apiRequests/useResetPasswordMutation";
import { validations } from "@spt/utils/validation";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const { resetPasswordHandler, isLoading } =
    useResetPasswordMutation();

  const validationSchema = Yup.object().shape({
    password: validations.password,
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Please re-enter your password"),
  });

  return (
    <main className="w-full max-w-none">
      <Stack className="w-full max-w-none space-y-8">
        {/* Header */}
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
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) =>
            resetPasswordHandler(values, actions, token)
          }
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

export default ResetPassword;
