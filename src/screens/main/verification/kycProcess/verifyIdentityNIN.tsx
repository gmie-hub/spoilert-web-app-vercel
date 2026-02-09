// "use client";

// import { useState } from "react";

// import { Form, Formik, FormikHelpers } from "formik";
// import * as Yup from "yup";

// import CustomUpload from "@spt/components/customUpload";
// import Input from "@spt/components/input";
// import StepLayout from "@spt/components/kycLayout";

// interface FormValues {
//   nin: string;
//   ninImage: File | null;
// }

// const initialValues: FormValues = {
//   nin: "",
//   ninImage: null,
// };

// const validationSchema = Yup.object({
//   nin: Yup.string()
//     .length(11, "NIN must be 11 digits")
//     .required("NIN is required"),
//   ninImage: Yup.mixed().required("NIN image is required"),
// });

// const VerifyIdentity = () => {
//   const [showWhy, setShowWhy] = useState(false);
//   const handleSubmit = (
//     values: FormValues,
//     actions: FormikHelpers<FormValues>,
//   ) => {
//     actions.setSubmitting(false);
//     // proceed to next step
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={handleSubmit}
//     >
//       {() => (
//         <Form>
//           <StepLayout
//             step={3}
//             totalSteps={4}
//             title="Verify Your NIN"
//             buttonLabel="Verify"
//             onButtonClick={() => {
//               document.querySelector<HTMLFormElement>("form")?.requestSubmit();
//             }}
//           >
//             <div className="w-full space-y-5">
//               {/* NIN INPUT */}
//               <Input name="nin" label="NIN Number" placeholder="NIN number" />

//               <CustomUpload
//                 name="profileImage"
//                 placeholder="Upload Image"
//                 label="Upload a photo of your NIN"
//               />
//               <div className="w-full bg-[#E0F4FD]  rounded-lg">
//                 <button
//                   type="button"
//                   onClick={() => setShowWhy((prev) => !prev)}
//                   className="flex w-full items-center justify-between rounded-lg  px-4 py-3 text-sm text-blue-700"
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--color-blue-dark)] text-[var(--color-blue-dark)] text-xs font-bold">
//                       i
//                     </span>
//                     <span className="text-[#212529]">Why we need your NIN</span>
//                   </div>

//                   <span
//                     className={`transition-transform ${
//                       showWhy ? "rotate-180" : ""
//                     }`}
//                   >
//                     ⌃
//                   </span>
//                 </button>

//                 {showWhy && (
//                   <div className="rounded-b-lg px-4 pb-4 pt-2 text-sm  text-[#495057] ">
//                     We need your NIN to verify your identity and ensure the
//                     security of your account. Be rest assured that we do not
//                     have access to your bank details.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </StepLayout>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default VerifyIdentity;
"use client";

import { useEffect, useState } from "react";

import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import CustomUpload from "@spt/components/customUpload";
import Input from "@spt/components/input";
import StepLayout from "@spt/components/kycLayout";
import { useVerifyIdentityMutation } from "@spt/hooks/apiRequests/useVerifyIdentityMutation";

interface FormValues {
  nin: string;
  docImage: File | null; // 👈 single upload field
}

const initialValues: FormValues = {
  nin: "",
  docImage: null,
};

const buildValidation = (isNigeria: boolean) =>
  Yup.object({
    nin: isNigeria
      ? Yup.string()
          .length(11, "NIN must be 11 digits")
          .required("NIN is required")
      : Yup.string().notRequired(),

    docImage: Yup.mixed().required(
      isNigeria ? "NIN image is required" : "ID image is required"
    ),
  });

const VerifyIdentity = ({ onNext }: { onNext: () => void }) => {
  const { verifyIdentityHandler, isLoading } =
    useVerifyIdentityMutation();

  const [isNigeria, setIsNigeria] = useState(false);

  useEffect(() => {
    const country = localStorage.getItem("selectedCountry");
    setIsNigeria(country === "NG");
  }, []);

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    if (!values.docImage) return;

    // ✅ endpoint auto handles NG vs others internally
    await verifyIdentityHandler(
      { image: values.docImage },
      actions.setSubmitting
    );
    onNext();
  };
  
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={buildValidation(isNigeria)}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <StepLayout
            step={3}
            totalSteps={4}
            title="Verify Your Identity"
            buttonLabel={isLoading ? "Verifying..." : "Verify"}
            onButtonClick={() =>
              document
                .querySelector<HTMLFormElement>("form")
                ?.requestSubmit()
            }
          >
            <div className="space-y-5">

              {/* 🇳🇬 ONLY SHOW NIN INPUT FOR NIGERIA */}
              {isNigeria && (
                <Input
                  name="nin"
                  label="NIN Number"
                  placeholder="Enter your NIN"
                />
              )}

              {/* 📸 ONE UPLOAD FIELD FOR BOTH FLOWS */}
              <CustomUpload
                name="docImage"
                label={
                  isNigeria
                    ? "Upload your NIN slip"
                    : "Upload government issued ID"
                }
                placeholder="Upload Image"
              />

            </div>
          </StepLayout>
        </Form>
      )}
    </Formik>
  );
};

export default VerifyIdentity;
