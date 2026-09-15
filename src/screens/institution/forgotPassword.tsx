"use client";

import { Form, Formik } from "formik";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import BackIcon from "@spt/assets/icons/arrow-left.svg";
import LogoMark from "@spt/assets/icons/Group(2).svg";
import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Stack from "@spt/components/stack";
import { useInstitutionForgotPasswordMutation } from "@spt/hooks/apiRequests/useInstitutionForgotPasswordMutation";
import { validations } from "@spt/utils/validation";

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const InstitutionForgotPassword = () => {
  const { forgotPasswordHandler, isLoading } =
    useInstitutionForgotPasswordMutation();
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    email: validations.email,
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
            Forgot Password
          </h1>
          <p className="text-sm sm:text-md text-gray-500 max-w-md">
            You don&rsquo;t have to worry. Enter the email address you used to
            register and we&rsquo;ll send you a code to reset your password.
          </p>
        </div>

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

        <p className="mx-auto text-center text-sm sm:text-md text-gray-500">
          Remembered Password?{" "}
          <Link
            href="/institution/login"
            className="font-medium text-[var(--color-yellow)] hover:underline"
          >
            Log In
          </Link>
        </p>
      </Stack>
    </main>
  );
};

export default InstitutionForgotPassword;
