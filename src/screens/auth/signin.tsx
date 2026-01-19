"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import * as Yup from "yup";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Stack from "@spt/components/stack";
import { useLoginMutation } from "@spt/hooks/apiRequests/useSigninMutation"; // Assuming you have a login hook
import { validations } from "@spt/utils/validation";

const Login = () => {
  const { loginHandler, isLoading } = useLoginMutation();
  const validationSchema = Yup.object().shape({
    email: validations.email,
    rememberMe: validations.rememberMe,
    password: validations.passwordLogin,
  });

  return (
    <main className="w-full max-w-none">
      <Stack className="w-full max-w-none space-y-8">
        <div className="space-y-2 w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
            Welcome Back 👋
          </h1>
          <p className="text-sm sm:text-md text-gray-500">
            Enter your details to log in
          </p>
        </div>

        {/* <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: false,
          }}
          validationSchema={validationSchema}
          onSubmit={loginHandler}
          validateOnMount
        >
          {({ values, handleChange, isValid }) => (
            <Form className="space-y-6 w-full max-w-none">
              <Input name="email" type="email" label="Email Address" />
              <Input name="password" type="password" label="Password" />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-gray-700 text-sm">
                  <Field
                    type="checkbox"
                    name="rememberMe"
                    checked={values.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 rounded"
                  />
                  Remember Me
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="text-[var(--color-yellow)] hover:underline font-medium text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              <ErrorMessage
                name="rememberMe"
                component="div"
                className="text-red-500"
              />

              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </Form>
          )}
        </Formik> */}
        <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: false,
          }}
          validationSchema={validationSchema}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={(values, { setSubmitting, setTouched }) => {
            // mark all fields as touched so errors appear
            setTouched({
              email: true,
              password: true,
              rememberMe: true,
            });
            loginHandler(values, { setSubmitting });
          }}
        >
          {({ values, handleChange, isValid, errors, touched }) => (
            <Form className="space-y-6 w-full max-w-none">
              <Input name="email" type="email" label="Email Address" />
              <Input name="password" type="password" label="Password" />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-gray-700 text-sm">
                  <Field
                    type="checkbox"
                    name="rememberMe"
                    checked={values.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 rounded"
                  />
                  Remember Me
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="text-[var(--color-yellow)] hover:underline font-medium text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              <ErrorMessage
                name="rememberMe"
                component="div"
                className="text-red-500"
              />

              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </Form>
          )}
        </Formik>

        <p className="mx-auto text-center text-sm sm:text-md text-gray-500">
          Don’t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-[var(--color-yellow)] hover:underline"
          >
            Sign Up
          </Link>
        </p>

        <p className="mx-auto text-center text-sm sm:text-md text-gray-500">
          OR
        </p>

        <Button
          variant="lightBlue"
          className="w-full flex items-center justify-center gap-2"
          iconLeft={<img src="/google.svg" alt="Google" className="h-5 w-5" />}
        >
          Continue with Google
        </Button>

        <Button
          variant="lightBlue"
          className="w-full flex items-center justify-center gap-2"
          iconLeft={
            <img src="/facebook.svg" alt="Facebook" className="h-5 w-5" />
          }
        >
          Continue with Facebook
        </Button>
      </Stack>
    </main>
  );
};

export default Login;
