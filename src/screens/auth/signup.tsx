"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { object } from "yup";

import FacebookIcon from "@spt/assets/icons/search 1.svg";
import GoogleIcon from "@spt/assets/icons/search 1.svg";
import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Stack from "@spt/components/stack";
import { useSignupMutation } from "@spt/hooks/apiRequests/useSignupMutation";
import { validations } from "@spt/utils/validation";

const SignUp = () => {
  const { signupHandler, isLoading } = useSignupMutation();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const validationSchema = object().shape({
    firstName: validations.firstName,
    lastName: validations.lastName,
    username: validations.username,
    email: validations.email,
    agreeToTerms: validations.agreeToTerms,
    password: validations.password,
    recaptcha: validations.recaptcha,
  });

  return (
    <main className="w-full max-w-none">
      <Stack className="w-full max-w-none space-y-8">
        <div className="space-y-2 w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
            Sign Up
          </h1>
          <p className="text-sm sm:text-md text-gray-500">
            Begin your journey with spoylz by signing up.
          </p>
        </div>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            agreeToTerms: false, // ✅ REQUIRED
            recaptcha: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, helpers) => {
            await signupHandler(values, helpers);
            // Reset the widget so a fresh token is required on retry.
            recaptchaRef.current?.reset();
            helpers.setFieldValue("recaptcha", "");
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-6 w-full max-w-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input name="firstName" label="First Name" />
                <Input name="lastName" label="Last Name" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input name="username" label="Username" />
                <Input name="email" type="email" label="Email Address" />
              </div>

              <Input name="password" type="password" label="Password" />
              <div className="flex items-center gap-2">
                <Field
                  type="checkbox"
                  name="agreeToTerms"
                  id="agreeToTerms"
                  className="h-4 w-4 border-gray-300 rounded"
                />

                <label htmlFor="agreeToTerms" className="text-gray-700 text-sm">
                  I agree to the platform&apos;s{" "}
                  <Link
                    href="/terms-conditions"
                    className="text-[var(--color-yellow)] hover:underline font-medium"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-[var(--color-yellow)] hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <ErrorMessage
                name="agreeToTerms"
                component="div"
                className="text-red-500 text-sm"
              />

              {recaptchaSiteKey && (
                <div>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={recaptchaSiteKey}
                    onChange={(token) =>
                      setFieldValue("recaptcha", token ?? "")
                    }
                    onExpired={() => setFieldValue("recaptcha", "")}
                  />
                  <ErrorMessage
                    name="recaptcha"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </Form>
          )}
        </Formik>
        <p className="mx-auto text-center text-sm sm:text-md text-gray-500">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-[var(--color-yellow)] hover:underline"
          >
            Log in
          </Link>
        </p>
        <p className="mx-auto text-center text-sm sm:text-md text-gray-500">
          OR
        </p>
        <Button
          variant="lightBlue"
          className="w-full flex items-center justify-center gap-2"
          iconLeft={
            <Image src={GoogleIcon  } alt="icon" width={24} height={24} />
          }
        >
          Continue with Google
        </Button>
        <Button
          variant="lightBlue"
          className="w-full flex items-center justify-center gap-2"
          iconLeft={
            <Image src={FacebookIcon} alt="icon" width={24} height={24} />
          }
        >
          Continue with Facebook
        </Button>{" "}
      </Stack>
    </main>
  );
};

export default SignUp;
