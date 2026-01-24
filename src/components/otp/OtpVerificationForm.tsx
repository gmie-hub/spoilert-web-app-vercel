import { Form, Formik } from "formik";
import * as Yup from "yup";

import Button from "@spt/components/button";

import OtpInput from "./OtpInput";

interface Props {
  onSubmit: (
    code: string,
    actions: any
  ) => void;
  isLoading?: boolean;
  length?: number;
}

const OtpVerificationForm = ({
  onSubmit,
  isLoading,
  length = 6,
}: Props) => {
  const validationSchema = Yup.object({
    code: Yup.string()
      .length(length, `Enter the ${length}-digit code`)
      .required("Verification code is required"),
  });

  return (
    <Formik
      initialValues={{ code: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => onSubmit(values.code, actions)}
    >
      {({ values, setFieldValue, handleSubmit }) => (
        <Form onSubmit={handleSubmit} className="space-y-6">
          <OtpInput
            length={length}
            value={values.code}
            onChange={(val) => setFieldValue("code", val)}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default OtpVerificationForm;
