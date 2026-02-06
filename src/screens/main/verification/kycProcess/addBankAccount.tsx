// "use client";

// import { useState } from "react";

// import { useMutation } from "@tanstack/react-query";
// import { Form, Formik, FormikHelpers } from "formik";
// import * as Yup from "yup";

// import Input from "@spt/components/input";
// import StepLayout from "@spt/components/kycLayout";
// import Select from "@spt/components/select";
// import { useGetBanksQuery } from "@spt/hooks/apiRequests/useGetBankQuery";

// import toast from "react-hot-toast";
// import { ApiErrorResponse } from "@spt/types/error";
// import api from "@spt/utils/apiClient";
// import type { AxiosError } from "axios";

// interface FormValues {
//   bankName: string; // stores bank.code
//   accountNumber: string;
// }

// const initialValues: FormValues = {
//   bankName: "",
//   accountNumber: "",
// };

// const validationSchema = Yup.object().shape({
//   bankName: Yup.string().required("Bank name is required"),
//   accountNumber: Yup.string()
//     .matches(/^\d{10}$/, "Account number must be 10 digits")
//     .required("Account number is required"),
// });

// // ✅ Bank Verification Mutation
// const useVerifyBankMutation = () => {
//   const mutationFn = async (payload: {
//     account_number: string;
//     bank_id: number;
//   }) => {
//     return (await api.post("  ", payload)).data;
//   };

//   const mutation = useMutation<
//     { account_name: string },
//     AxiosError<ApiErrorResponse>,
//     { account_number: string; bank_id: number }
//   >({
//     mutationKey: ["verify-bank"],
//     mutationFn,
//   });

//   const verifyBank = async (account_number: string, bank_id: number) => {
//     try {
//       const result = await mutation.mutateAsync({ account_number, bank_id });
//       toast.success("Bank account verified ✅");
//       return result.account_name;
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to verify bank account",
//       );
//       return null;
//     }
//   };

//   return { verifyBank, isVerifying: mutation.isPending };
// };
// console;
// const AddBankAccountStep = () => {
//   const [bankSearch, setBankSearch] = useState("");
//   const [accountName, setAccountName] = useState<string | null>(null);

//   const { data, isLoading, isError, errorMessage } =
//     useGetBanksQuery(bankSearch);

//   const bankOptions =
//     data?.data?.map((bank: any) => ({
//       value: bank.code, // Formik stores this
//       label: bank.name,
//     })) || [];

//   const { verifyBank, isVerifying } = useVerifyBankMutation();

//   /** ✅ Verify using the actual bank id from API */
//   const handleAccountNumberChange = async (
//     accountNumber: string,
//     bankCode: string,
//   ) => {
//     if (accountNumber.length === 10 && bankCode) {
//       const bankObj = data?.data?.find((b: any) => b.code === bankCode);
//       if (!bankObj) return;

//       const name = await verifyBank(accountNumber, bankObj.id); // pass correct bank_id
//       setAccountName(name);
//     } else {
//       setAccountName(null);
//     }
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={(values: FormValues, actions: FormikHelpers<FormValues>) => {
//         console.log("Submitted Values:", values);
//         actions.setSubmitting(false);
//       }}
//     >
//       {({ submitForm, values, setFieldValue }) => (
//         <Form>
//           <StepLayout
//             step={4}
//             totalSteps={4}
//             title="Add Bank Account"
//             description=""
//             buttonLabel="Save Bank Details"
//             onButtonClick={submitForm}
//           >
//             <div className="w-full space-y-4">
//               {/* Info Notice */}
//               <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm">
//                 Note that only one bank account can be added to receive
//                 payments. Please verify that your details are correct before
//                 saving.
//               </div>

//               {/* Bank Name Select */}
//               <Select
//                 name="bankName"
//                 label="Bank Name"
//                 searchable={true}
//                 // filterOnFrontend={false}
//                 placeholder={
//                   isLoading ? "Loading banks..." : "Select bank name"
//                 }
//                 options={bankOptions}
//                 disabled={isLoading}
//                 onSearchChange={(value) => setBankSearch(value)}
//               />

//               {/* Error Message */}
//               {isError && (
//                 <p className="text-red-500 text-sm">{errorMessage}</p>
//               )}

//               {/* Account Number */}
//               <Input
//                 name="accountNumber"
//                 label="Account Number"
//                 placeholder="Enter account number"
//                 onChange={(val: string) => {
//                   setFieldValue("accountNumber", val);
//                   handleAccountNumberChange(val, values.bankName);
//                 }}
//               />

//               {/* Display Verified Account Name */}
//               {isVerifying && (
//                 <p className="text-sm text-red">Verifying account number...</p>
//               )}
//               {accountName && !isVerifying && (
//                 <p className="text-sm text-green-600 font-medium">
//                   Account Name: {accountName}
//                 </p>
//               )}
//             </div>
//           </StepLayout>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default AddBankAccountStep;

// "use client";

// import { useState } from "react";

// import { Form, Formik, FormikHelpers } from "formik";
// import * as Yup from "yup";

// import Input from "@spt/components/input";
// import StepLayout from "@spt/components/kycLayout";
// import Select from "@spt/components/select";
// import { useGetBanksQuery } from "@spt/hooks/apiRequests/useGetBankQuery";
// import { useVerifyBankMutation } from "@spt/hooks/apiRequests/useVerifyBankAccountMutation";

// interface FormValues {
//   bankName: string; // stores bank.code
//   accountNumber: string;
// }

// const initialValues: FormValues = {
//   bankName: "",
//   accountNumber: "",
// };

// const validationSchema = Yup.object().shape({
//   bankName: Yup.string().required("Bank name is required"),
//   accountNumber: Yup.string()
//     .matches(/^\d{10}$/, "Account number must be 10 digits")
//     .required("Account number is required"),
// });

// const AddBankAccountStep = () => {
//   const [bankSearch, setBankSearch] = useState("");
//   const [accountName, setAccountName] = useState<string | null>(null);

//   const { data, isLoading, isError, errorMessage } =
//     useGetBanksQuery(bankSearch);

//   const bankOptions =
//     data?.data?.map((bank: any) => ({
//       value: bank.code, // Formik stores this
//       label: bank.name,
//     })) || [];

//   const {
//     verifiedAccount,
//     verifyBankHandler,
//     isLoading: isVerifying,
//   } = useVerifyBankMutation();
//   console.log(verifiedAccount, "verifiedAccountverifiedAccount");
//   /** ===============================
//    * Handle Account Number Change
//    * Only allow 10 digits max
//    * Verify when length === 10
//    =============================== */
//   const handleAccountNumberChange = async (
//     accountNumber: string,
//     bankCode: string,
//   ) => {
//     if (accountNumber.length > 10) return; // prevent more than 10

//     setAccountName(null);

//     if (accountNumber.length === 10 && bankCode) {
//       const bankObj = data?.data?.find((b: any) => b.code === bankCode);
//       if (!bankObj) return;

//       const result = await verifyBankHandler(accountNumber, bankObj.id);
//     }
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={(values: FormValues, actions: FormikHelpers<FormValues>) => {
//         console.log("Submitted Values:", values);
//         actions.setSubmitting(false);
//       }}
//     >
//       {({ submitForm, values, setFieldValue }) => (
//         <Form>
//           <StepLayout
//             step={4}
//             totalSteps={4}
//             title="Add Bank Account"
//             description=""
//             buttonLabel="Save Bank Details"
//             onButtonClick={submitForm}
//           >
//             <div className="w-full space-y-4">
//               {/* Info Notice */}
//               <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm">
//                 Note that only one bank account can be added to receive
//                 payments. Please verify that your details are correct before
//                 saving.
//               </div>

//               {/* Bank Name Select */}
//               <Select
//                 name="bankName"
//                 label="Bank Name"
//                 searchable={true}
//                 // filterOnFrontend={false}
//                 placeholder={
//                   isLoading ? "Loading banks..." : "Select bank name"
//                 }
//                 options={bankOptions}
//                 disabled={isLoading}
//                 onSearchChange={(value) => setBankSearch(value)}
//               />

//               {/* Error Message */}
//               {isError && (
//                 <p className="text-red-500 text-sm">{errorMessage}</p>
//               )}

//               {/* Account Number */}
//               <Input
//                 name="accountNumber"
//                 label="Account Number"
//                 placeholder="Enter account number"
//                 onChange={(val: string) => {
//                   setFieldValue("accountNumber", val);
//                   handleAccountNumberChange(val, values.bankName);
//                 }}
//               />

//               {/* Verified Account Name / Loading / Error */}
//               {isVerifying && (
//                 <p className="text-sm text-gray-500">
//                   Verifying account number...
//                 </p>
//               )}
//               {verifiedAccount && !isVerifying && (
//                 <p className="text-sm text-green-600 font-medium">
//                   Account Name:{" "}
//                   {verifiedAccount?.data &&
//                     verifiedAccount?.data.res?.account_name}
//                 </p>
//               )}
//               {verifiedAccount && !isVerifying && (
//                 <p className="text-sm text-red-500 font-medium">
//                   {verifiedAccount?.message}
//                 </p>
//               )}
//             </div>
//           </StepLayout>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default AddBankAccountStep;

"use client";

import { useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import Input from "@spt/components/input";
import StepLayout from "@spt/components/kycLayout";
import Select from "@spt/components/select";
import { useGetBanksQuery } from "@spt/hooks/apiRequests/useGetBankQuery";
import { useVerifyBankMutation } from "@spt/hooks/apiRequests/useVerifyBankAccountMutation";
import { useAddBankAccountMutation } from "@spt/hooks/apiRequests/useAddBankAccMutation";

interface FormValues {
  bankName: string; // stores bank.code
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
  const [bankSearch, setBankSearch] = useState("");
  const [accountName, setAccountName] = useState<string | null>(null);

  const { data, isLoading, isError, errorMessage } =
    useGetBanksQuery(bankSearch);

  const bankOptions =
    data?.data?.map((bank: any) => ({
      value: bank.code,
      label: bank.name,
    })) || [];

  const {
    verifiedAccount,
    verifyBankHandler,
    isLoading: isVerifying,
  } = useVerifyBankMutation();

  const { addBankAccountHandler, isLoading: isAdding } =
    useAddBankAccountMutation();

  /** ===============================
   * Handle Account Number Change
   * Only allow 10 digits max
   * Verify when length === 10
   =============================== */
  const handleAccountNumberChange = async (
    accountNumber: string,
    bankCode: string,
  ) => {
    if (accountNumber.length > 10) return;

    setAccountName(null);

    if (accountNumber.length === 10 && bankCode) {
      const bankObj = data?.data?.find((b: any) => b.code === bankCode);
      if (!bankObj) return;

      const result = await verifyBankHandler(accountNumber, bankObj.id);

      if (result?.data?.res?.account_name) {
        setAccountName(result.data.res.account_name);
      } else {
        setAccountName(null);
      }
    }
  };

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    if (!accountName) return;

    const bankObj = data?.data?.find((b: any) => b.code === values.bankName);
    if (!bankObj) return;

    try {
      await addBankAccountHandler(values.accountNumber, bankObj.id);
      actions.setSubmitting(false);
    } catch (error) {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, values, setFieldValue, isSubmitting }) => (
        <Form>
          <StepLayout
            step={4}
            totalSteps={4}
            title="Add Bank Account"
            description=""
            buttonLabel="Save Bank Details"
            onButtonClick={submitForm}
            buttonDisabled={
              !accountName || isVerifying || isAdding || isSubmitting
            } // <--- disable if account not verified
          >
            <div className="w-full space-y-4">
              {/* Info Notice */}
              <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm">
                Note that only one bank account can be added to receive
                payments. Please verify that your details are correct before
                saving.
              </div>

              {/* Bank Name Select */}
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
              />

              {/* Error Message */}
              {isError && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}

              {/* Account Number */}
              <Input
                // disabled={values?.bankName ===''}
                name="accountNumber"
                label="Account Number"
                placeholder="Enter account number"
                onChange={(val: string) => {
                  setFieldValue("accountNumber", val);
                  handleAccountNumberChange(val, values.bankName);
                }}
              />

              {/* Verified Account Name / Loading / Error */}
              {isVerifying && (
                <p className="text-sm text-gray-500">
                  Verifying account number...
                </p>
              )}
              {accountName && !isVerifying && (
                <p className="text-sm text-green-600 font-medium">
                  Account Name: {accountName}
                </p>
              )}
              {verifiedAccount &&
                verifiedAccount.message &&
                !accountName &&
                !isVerifying && (
                  <p className="text-sm text-red-500 font-medium">
                    {verifiedAccount.message}
                  </p>
                )}
            </div>
          </StepLayout>
        </Form>
      )}
    </Formik>
  );
};

export default AddBankAccountStep;
