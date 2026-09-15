import { Form, Formik } from "formik";
import * as Yup from "yup";

import { Card } from "@spt/components";
import Button from "@spt/components/button";
import Input from "@spt/components/input";
import { validations } from "@spt/utils/validation";

const passwordSchema = Yup.object({
  password: validations.password,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please re-enter your password"),
});

const CreatePasswordStep = ({
  institutionName,
  institutionEmail,
  onSuccess,
}: {
  institutionName: string;
  institutionEmail: string;
  onSuccess: () => void;
}) => (
  <main className="w-full bg-white">
    <Card className="mx-auto my-10 w-full max-w-[648px] rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10 sm:my-14">
      <h1 className="text-center text-2xl font-semibold text-[#212529] sm:text-[28px]">
        Create a Password
      </h1>
      <p className="mx-auto mt-2 max-w-[420px] text-center text-sm text-[#6B7280]">
        Create your log in password to access the {institutionName} institution
        account.
      </p>

      <Formik
        initialValues={{
          email: institutionEmail,
          password: "",
          confirmPassword: "",
        }}
        validationSchema={passwordSchema}
        validateOnBlur
        validateOnChange={false}
        onSubmit={(_values, actions) => {
          actions.setSubmitting(false);
          onSuccess();
        }}
      >
        {({ isValid, isSubmitting }) => (
          <Form className="mt-8 space-y-5">
            <Input name="email" label="Email Address" disabled />
            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Create your password"
            />
            <Input
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isSubmitting}
            >
              Continue
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  </main>
);

export default CreatePasswordStep;
