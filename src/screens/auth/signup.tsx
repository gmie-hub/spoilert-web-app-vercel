"use client";

import { Form, Formik } from "formik";
import Link from "next/link";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Stack from "@spt/components/stack";

const SignUp = () => {
  return (
    <main>
      <Stack>
        <h1 className="text-2xl font-semibold text-gray-900">Sign Up</h1>
        <p className="mt-1 text-sm text-gray-500">
          Begin your journey with Spoilt by signing up.
        </p>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
          }}
          onSubmit={(values) => console.log(values)}
        >
          <Form className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="firstName" label="First Name" />
              <Input name="lastName" label="Last Name" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="username" label="Username" />
              <Input name="email" type="email" label="Email Address" />
            </div>

            <Input name="password" type="password" label="Password" />

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1 h-4 w-4" />
              <p className="text-gray-600">
                I agree to the{" "}
                <Link href="#" className="text-teal-600">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-teal-600">
                  Privacy Policy
                </Link>
              </p>
            </div>

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </Form>
        </Formik>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-teal-600 font-medium">
            Log in
          </Link>
        </p>
      </Stack>
    </main>
  );
};

export default SignUp;
