"use client";

import { Form, Formik,  FormikHelpers } from "formik";
import * as Yup from "yup";

import Input from "@spt/components/input";
import StepLayout from "@spt/components/kycLayout";
import Select from "@spt/components/select";

interface FormValues {
  bankName: string;
  accountNumber: string;
}

const initialValues: FormValues = {
  bankName: "",
  accountNumber: "",
};

const validationSchema = Yup.object().shape({
  bankName: Yup.string().required("Bank name is required"),
  accountNumber: Yup.string()
    .matches(/^\d{10}$/, "Account number must be 10 digits")
    .required("Account number is required"),
});

const AddBankAccountStep = () => {
  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    console.log(values);
    actions.setSubmitting(false);
    // proceed to next step / API call
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm }) => (
        <Form>
          <StepLayout
            step={4}
            totalSteps={4}
            title="Add Bank Account"
            description=""
            buttonLabel="Save Bank Details"
            onButtonClick={submitForm}
          >
            <div className="w-full space-y-4">
              {/* Info Notice */}   
              <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700">
                Note that only one bank account can be added to receive
                payments. Please verify that your details are correct before
                saving.
              </div>

              {/* Bank Name */}
              <Select
                name="bankName"
                label="Bank Name"
                placeholder="Select bank name"
                options={[
                  { value: "gtb", label: "GTBank" },
                  { value: "access", label: "Access Bank" },
                  { value: "uba", label: "UBA" },
                  { value: "zenith", label: "Zenith Bank" },
                ]}
              />

              {/* Account Number */}
              <Input
                name="accountNumber"
                label="Account Number"
                placeholder="Enter account number"
                
              />
            </div>
          </StepLayout>
        </Form>
      )}
    </Formik>
  );
};

export default AddBankAccountStep;
