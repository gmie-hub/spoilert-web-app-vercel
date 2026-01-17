"use client";

import { Form, Formik } from "formik";
import Link from "next/link";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Stack from "@spt/components/stack";
import { useSignUpMutation } from "@spt/hooks/apiRequests/useSignupMutation";

const SignUp = () => {
  const { mutate: signUp, isPending } = useSignUpMutation();

  return (
    <main className="w-full max-w-none">
      <Stack className="w-full max-w-none space-y-8">
        <div className="space-y-2 w-full">
          <h1 className="text-[2.4rem] font-semibold text-gray-900">
            Sign Up
          </h1>
          <p className="text-gray-500">
            Begin your journey with Spoilt by signing up.
          </p>
        </div>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
          }}
          // validationSchema={validations}
          onSubmit={(values) => {
            signUp({
              email: values.email,
              password: values.password,
              username: values.username,
              first_name: values.firstName,
              last_name: values.lastName,
            });
          }}
        >
          {({ isValid, dirty }) => (
            <Form className="space-y-6 w-full max-w-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input name="firstName" label="First Name" />
                <Input name="lastName" label="Last Name" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input name="username" label="Username" />
                <Input name="email" type="email" label="Email Address" />
              </div>

              <Input
                name="password"
                type="password"
                label="Password"
              />

              <Button
                type="submit"
                disabled={!isValid || !dirty || isPending}
                className="w-full"
              >
                {isPending ? "Creating account..." : "Sign Up"}
              </Button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-[1.4rem] text-gray-500">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-teal-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </Stack>
    </main>
  );
};

export default SignUp;
