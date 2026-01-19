// "use client";

// import { useState } from "react";

// import { Form, Formik } from "formik";
// import * as Yup from "yup";

// import Button from "@spt/components/button";

// const VerifyEmail = () => {
// const [timer, setTimer] = useState(27);

// const validationSchema = Yup.object({
//     code: Yup.string()
//     .length(6, "Enter the 6-digit code")
//     .required("Verification code is required"),
// });

// return (
//     <main className="w-full max-w-none">
//         {/* Illustration */}
//         <div className="flex justify-center">
//         <img
//             src="/verify-email.png"
//             alt="Verify email"
//             className="h-32 object-contain"
//         />
//         </div>

//         {/* Header */}
//         <div className="text-center space-y-2">
//         <h1 className="text-2xl font-semibold text-gray-900">
//             Verify Your Email Address
//         </h1>
//         <p className="text-sm text-gray-500">
//             A six digit code has been sent to
//             <span className="font-medium text-gray-700">
//             ogunsolaomorinsola@gmail.com
//             </span>
//             enter the code to verify you email address.
//         </p>
//         </div>

//         {/* Form */}
//         <Formik
//         initialValues={{ code: "" }}
//         validationSchema={validationSchema}
//         onSubmit={(values) => {
//             console.log(values.code);
//         }}
//         >
//         {({ values, setFieldValue, handleSubmit }) => (
//             <Form onSubmit={handleSubmit} className="space-y-6">
//             {/* OTP Inputs */}
//             <div className="flex justify-between gap-3">
//                 {Array.from({ length: 6 }).map((_, index) => (
//                 <input
//                     key={index}
//                     type="text"
//                     maxLength={1}
//                     value={values.code[index] || ""}
//                     onChange={(e) => {
//                     const val = e.target.value.replace(/\D/g, "");
//                     const newCode =
//                         values.code.substring(0, index) +
//                         val +
//                         values.code.substring(index + 1);
//                     setFieldValue("code", newCode);
//                     }}
//                     className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                 />
//                 ))}
//             </div>

//             {/* Button */}
//             <Button type="submit" className="w-full">
//                 Verify
//             </Button>
//             </Form>
//         )}
//         </Formik>

//         {/* Resend */}
//         <p className="text-sm text-center text-gray-500 pt-5">
//         Didn’t get code?{" "}
//         {timer > 0 ? (
//             <span>
//             can resend in{" "}
//             <span className="text-primary font-medium">
//                 00:{timer.toString().padStart(2, "0")}
//             </span>
//             </span>
//         ) : (
//             <button className="text-primary font-medium hover:underline">
//             Resend Code
//             </button>
//         )}
//         </p>
//     </main>
// );
// };

// export default VerifyEmail;

"use client";

import { useEffect, useRef, useState } from "react";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import Button from "@spt/components/button";

const VerifyEmail = () => {
  const [timer, setTimer] = useState(27);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Auto focus first OTP input
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const validationSchema = Yup.object({
    code: Yup.string()
      .length(6, "Enter the 6-digit code")
      .required("Verification code is required"),
  });

  return (
    <main className="w-full max-w-none">
      {/* Illustration */}
      <div className="flex justify-center">
        <img
          src="/verify-email.png"
          alt="Verify email"
          className="h-32 object-contain"
        />
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          Verify Your Email Address
        </h1>
        <p className="text-sm text-gray-500">
          A six digit code has been sent to{" "}
          <span className="font-medium text-gray-700">
            ogunsolaomorinsola@gmail.com
          </span>{" "}
          enter the code to verify your email address.
        </p>
      </div>

      {/* Form */}
      <Formik
        initialValues={{ code: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values.code);
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Inputs */}
            <div className="flex justify-between gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={values.code[index] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (!val) return;

                    const newCode =
                      values.code.substring(0, index) +
                      val +
                      values.code.substring(index + 1);

                    setFieldValue("code", newCode);

                    // Move to next input
                    if (index < 5) {
                      inputsRef.current[index + 1]?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      !values.code[index] &&
                      index > 0
                    ) {
                      inputsRef.current[index - 1]?.focus();
                    }
                  }}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ))}
            </div>

            {/* Button */}
            <Button type="submit" className="w-full">
              Verify
            </Button>
          </Form>
        )}
      </Formik>

      {/* Resend */}
      <p className="text-sm text-center text-gray-500 pt-5">
        Didn’t get code?{" "}
        {timer > 0 ? (
          <span>
            can resend in{" "}
            <span className="text-primary font-medium">
              00:{timer.toString().padStart(2, "0")}
            </span>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setTimer(27)}
            className="text-primary font-medium hover:underline"
          >
            Resend Code
          </button>
        )}
      </p>
    </main>
  );
};

export default VerifyEmail;
