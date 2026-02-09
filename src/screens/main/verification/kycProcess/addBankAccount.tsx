
// "use client";

// import { useEffect, useState } from "react";
// import { Form, Formik, FormikHelpers } from "formik";
// import { object } from "yup";

// import Button from "@spt/components/button";
// import Input from "@spt/components/input";
// import StepLayout from "@spt/components/kycLayout";
// import Select from "@spt/components/select";
// import { useAddBankAccountMutation } from "@spt/hooks/apiRequests/useAddBankAccMutation";
// import { useGetBanksQuery } from "@spt/hooks/apiRequests/useGetBankQuery";
// import { useVerifyBankMutation } from "@spt/hooks/apiRequests/useVerifyBankAccountMutation";
// import { validations } from "@spt/utils/validation";

// interface FormValues {
//   bankName: string; // stores bank.code
//   accountNumber: string;
// }

// const validationSchema = object().shape({
//   accountNumber: validations.accountNumber,
//   bankName: validations.bankName,
// });

// const AddBankAccountStep = () => {
//   const [bankSearch, setBankSearch] = useState("");
//   const [accountName, setAccountName] = useState<string | null>(null);

//   const { data, isLoading } = useGetBanksQuery(bankSearch);

//   const bankOptions =
//     data?.data?.map((bank: any) => ({
//       value: bank.code,
//       label: bank.name,
//     })) || [];

//   const {
//     verifiedAccount,
//     verifyBankHandler,
//     isLoading: isVerifying,
//     errorMessage: verifyErrorMessage,
//   } = useVerifyBankMutation();

//   const { addBankAccountHandler, isLoading: isAdding } =
//     useAddBankAccountMutation();

//   const verifyAccount = async (accountNumber: string, bankCode: string) => {
//     if (accountNumber.length !== 10 || !bankCode) return;

//     const bankObj = data?.data?.find((b: any) => b.code === bankCode);
//     if (!bankObj) return;

//     const result = await verifyBankHandler(accountNumber, bankObj.id);

//     if (result?.data?.res?.account_name) {
//       setAccountName(result.data.res.account_name);
//     } else {
//       setAccountName(null);
//     }
//   };

//   const handleAccountNumberChange = async (
//     accountNumber: string,
//     bankCode: string
//   ) => {
//     if (accountNumber.length > 10) return;

//     // clear previous verification
//     setAccountName(null);

//     // verify if 10 digits
//     await verifyAccount(accountNumber, bankCode);
//   };

//   const handleSubmit = async (
//     values: FormValues,
//     actions: FormikHelpers<FormValues>
//   ) => {
//     if (!accountName) return;

//     const bankObj = data?.data?.find((b: any) => b.code === values.bankName);
//     if (!bankObj) return;

//     try {
//       await addBankAccountHandler(values.accountNumber, bankObj.id);
//       actions.setSubmitting(false);
//     } catch (error) {
//       actions.setSubmitting(false);
//     }
//   };

//   return (
//     <Formik
//       initialValues={{ accountNumber: "", bankName: "" }}
//       validationSchema={validationSchema}
//       onSubmit={handleSubmit}
//     >
//       {({ values, setFieldValue }) => {

//         // VERIFY AGAIN when bank changes (while account number already has 10 digits)
//         useEffect(() => {
//           if (values.accountNumber.length === 10 && values.bankName) {
//             verifyAccount(values.accountNumber, values.bankName);
//           }
//         }, [values.bankName]);

//         return (
//           <Form>
//             <StepLayout
//               step={4}
//               totalSteps={4}
//               title="Add Bank Account"
//               description=""
//               showButton={false}
//             >
//               <div className="w-full space-y-4">
//                 <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm">
//                   Note that only one bank account can be added to receive
//                   payments. Please verify that your details are correct before
//                   saving.
//                 </div>

//                 <Select
//                   name="bankName"
//                   label="Bank Name"
//                   searchable={true}
//                   placeholder={
//                     isLoading ? "Loading banks..." : "Select bank name"
//                   }
//                   options={bankOptions}
//                   disabled={isLoading}
//                   onSearchChange={(value) => setBankSearch(value)}
//                   onChange={(value) => setFieldValue("bankName", value)}
//                 />

//                 <Input
//                   name="accountNumber"
//                   label="Account Number"
//                   placeholder="Enter account number"
//                   disabled={!values.bankName}
//                   onValueChange={(value) => {
//                     setFieldValue("accountNumber", value);
//                     handleAccountNumberChange(value, values.bankName);
//                   }}
//                 />

//                 <Button type="submit" disabled={isAdding} className="w-full">
//                   {isAdding ? "Saving..." : "Save Bank Details"}
//                 </Button>

//                 {isVerifying && (
//                   <p className="text-sm text-gray-500">
//                     Verifying account number...
//                   </p>
//                 )}

//                 {accountName && !isVerifying && (
//                   <p className="text-sm text-green-600 font-medium">
//                     Account Name: {accountName}
//                   </p>
//                 )}

//                 {values.accountNumber?.length === 10  && !accountName && verifiedAccount?.message && !isVerifying && (
//                   <p className="text-sm text-red-500 font-medium">
//                     {verifyErrorMessage}
//                   </p>
//                 )}
//               </div>
//             </StepLayout>
//           </Form>
//         );
//       }}
//     </Formik>
//   );
// };

// export default AddBankAccountStep;
"use client";

import { useEffect, useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { object } from "yup";
import { useRouter } from "next/navigation";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import StepLayout from "@spt/components/kycLayout";
import Select from "@spt/components/select";

import { useGetBanksQuery } from "@spt/hooks/apiRequests/useGetBankQuery";
import { useVerifyBankMutation } from "@spt/hooks/apiRequests/useVerifyBankAccountMutation";

import { validations } from "@spt/utils/validation";

interface FormValues {
  bankName: string; // stores bank.code
  accountNumber: string;
}

const validationSchema = object().shape({
  accountNumber: validations.accountNumber,
  bankName: validations.bankName,
});

const AddBankAccountStep = () => {
  const router = useRouter();

  const [bankSearch, setBankSearch] = useState("");
  const [accountName, setAccountName] = useState<string | null>(null);

  /* ================================
     FETCH BANKS
  ================================ */
  const { data, isLoading } = useGetBanksQuery(bankSearch);

  const bankOptions =
    data?.data?.map((bank: any) => ({
      value: bank.code,
      label: bank.name,
    })) || [];

  /* ================================
     VERIFY ACCOUNT MUTATION
  ================================ */
  const {
    verifiedAccount,
    verifyBankHandler,
    isLoading: isVerifying,
    errorMessage: verifyErrorMessage,
  } = useVerifyBankMutation();

  /* ================================
     VERIFY ACCOUNT FUNCTION
  ================================ */
  const verifyAccount = async (accountNumber: string, bankCode: string) => {
    if (accountNumber.length !== 10 || !bankCode) return;

    const bankObj = data?.data?.find((b: any) => b.code === bankCode);
    if (!bankObj) return;

    const result = await verifyBankHandler(accountNumber, bankObj.id);

    if (result?.data?.res?.account_name) {
      setAccountName(result.data.res.account_name);
    } else {
      setAccountName(null);
    }
  };

  /* ================================
     HANDLE ACCOUNT INPUT CHANGE
  ================================ */
  const handleAccountNumberChange = async (
    accountNumber: string,
    bankCode: string
  ) => {
    if (accountNumber.length > 10) return;

    // Clear previous verification
    setAccountName(null);

    // Verify once it's 10 digits
    await verifyAccount(accountNumber, bankCode);
  };

  /* ================================
     SUBMIT HANDLER
     (SAVE TO LOCAL STORAGE)
  ================================ */
  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    if (!accountName) return;

    const bankObj = data?.data?.find((b: any) => b.code === values.bankName);
    if (!bankObj) return;

    // ✅ Save everything as ONE object
    const bankDetails = {
      accountNumber: values.accountNumber,
      bankId: bankObj.id,
      bankName: bankObj.name,
      accountName: accountName,
    };

    localStorage.setItem("bankDetails", JSON.stringify(bankDetails));

    actions.setSubmitting(false);

    // ✅ Go to confirmation screen
    // router.push("/kyc/sure-to-save-bank-account");
  };

  /* ================================
     FORM
  ================================ */
  return (
    <Formik
      initialValues={{ accountNumber: "", bankName: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => {
        // VERIFY AGAIN when bank changes
        useEffect(() => {
          if (values.accountNumber.length === 10 && values.bankName) {
            verifyAccount(values.accountNumber, values.bankName);
          }
        }, [values.bankName]);

        return (
          <Form>
            <StepLayout
              step={4}
              totalSteps={4}
              title="Add Bank Account"
              description=""
              showButton={false}
            >
              <div className="w-full space-y-4">
                {/* Note */}
                <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm">
                  Note that only one bank account can be added to receive
                  payments. Please verify that your details are correct before
                  saving.
                </div>

                {/* Bank Select */}
                <Select
                  name="bankName"
                  label="Bank Name"
                  searchable={true}
                  placeholder={
                    isLoading ? "Loading banks..." : "Select bank name"
                  }
                  options={bankOptions}
                  disabled={isLoading}
                  onSearchChange={(value) => setBankSearch(value)}
                  onChange={(value) => setFieldValue("bankName", value)}
                />

                {/* Account Number */}
                <Input
                  name="accountNumber"
                  label="Account Number"
                  placeholder="Enter account number"
                  disabled={!values.bankName}
                  onValueChange={(value) => {
                    setFieldValue("accountNumber", value);
                    handleAccountNumberChange(value, values.bankName);
                  }}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!accountName}
                  className="w-full"
                >
                  Continue
                </Button>

                {/* Loading */}
                {isVerifying && (
                  <p className="text-sm text-gray-500">
                    Verifying account number...
                  </p>
                )}

                {/* Success */}
                {accountName && !isVerifying && (
                  <p className="text-sm text-green-600 font-medium">
                    Account Name: {accountName}
                  </p>
                )}

                {/* Error */}
                {values.accountNumber.length === 10 &&
                  !accountName &&
                  verifyErrorMessage &&
                  !isVerifying && (
                    <p className="text-sm text-red-500 font-medium">
                      {verifyErrorMessage}
                    </p>
                  )}
              </div>
            </StepLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddBankAccountStep;
