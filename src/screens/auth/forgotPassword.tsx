"use client";

import { Form, Formik } from "formik";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import BackIcon from "@spt/assets/icons/arrow-left.svg";
import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Stack from "@spt/components/stack";
import { useForgotPasswordMutation } from "@spt/hooks/apiRequests/useForgotPasswordMutation";
import { validations } from "@spt/utils/validation";

const ForgotPassword = () => {
  const { forgotPasswordHandler, isLoading } = useForgotPasswordMutation();
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    email: validations.email,
  });

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="w-full max-w-none">
      <Stack className="w-full max-w-none space-y-8">
        {/* Header */}

        <motion.div
          onClick={router.back}
          variants={childVariants}
          className="flex justify-right  w-full"
          whileHover={{ scale: 1.05 }}
        >
          <Image src={BackIcon} alt=" " width={24} height={24} />
          <span>Back</span>
        </motion.div>
        <div className="space-y-2 w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
            Forgot Password
          </h1>
          <p className="text-sm sm:text-md text-gray-500 max-w-md">
            You don’t have to worry. Enter the email address you used to
            register and we’ll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => forgotPasswordHandler(values, actions)}
        >
          {({ isValid }) => (
            <Form className="space-y-6 w-full max-w-none">
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="example@domain.com"
              />

              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full"
              >
                {isLoading ? "Sending..." : "Submit"}
              </Button>
            </Form>
          )}
        </Formik>

        {/* Footer Link */}
        <p className="mx-auto text-center text-sm sm:text-md text-gray-500">
          Remember Password?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-[var(--color-yellow)] hover:underline"
          >
            Log In
          </Link>
        </p>
      </Stack>
    </main>
  );
};

export default ForgotPassword;
