
// "use client";

// import { Form, Formik } from "formik";
// import Link from "next/link";

// import Button from "@spt/components/button";
// import Input from "@spt/components/input";
// import Stack from "@spt/components/stack";

// const SignUp = () => {
//   return (
//     <main className="w-full">
//       <Stack className="w-full max-w-md mx-auto space-y-6">
//         {/* Header */}
//         <div className="space-y-1">
//           <h1 className="text-2xl font-semibold text-gray-900">
//             Sign Up
//           </h1>
//           <p className="text-sm text-gray-500">
//             Begin your journey with Spoilt by signing up.
//           </p>
//         </div>

//         {/* Form */}
//         <Formik
//           initialValues={{
//             firstName: "",
//             lastName: "",
//             username: "",
//             email: "",
//             password: "",
//           }}
//           onSubmit={(values) => {
//             console.log(values);
//           }}
//         >
//           <Form className="space-y-5">
//             {/* First & Last Name */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <Input name="firstName" label="First Name" />
//               <Input name="lastName" label="Last Name" />
//             </div>

//             {/* Username & Email */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <Input name="username" label="Username" />
//               <Input
//                 name="email"
//                 type="email"
//                 label="Email Address"
//               />
//             </div>

//             {/* Password */}
//             <Input
//               name="password"
//               type="password"
//               label="Password"
//             />

//             {/* Terms */}
//             <label className="flex items-start gap-3 text-sm text-gray-600">
//               <input
//                 type="checkbox"
//                 className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
//               />
//               <span>
//                 I agree to the{" "}
//                 <Link
//                   href="#"
//                   className="text-teal-600 hover:underline"
//                 >
//                   Terms & Conditions
//                 </Link>{" "}
//                 and{" "}
//                 <Link
//                   href="#"
//                   className="text-teal-600 hover:underline"
//                 >
//                   Privacy Policy
//                 </Link>
//               </span>
//             </label>

//             {/* Submit */}
//             <Button type="submit" className="w-full">
//               Sign Up
//             </Button>
//           </Form>
//         </Formik>

//         {/* Footer */}
//         <p className="text-center text-sm text-gray-500">
//           Already have an account?{" "}
//           <Link
//             href="/auth/login"
//             className="text-teal-600 font-medium hover:underline"
//           >
//             Log in
//           </Link>
//         </p>
//       </Stack>
//     </main>
//   );
// };

// export default SignUp;

"use client";

import { Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Stack from "@spt/components/stack";

const SignUp = () => {
  return (
    <main className="w-full">
      <Stack className="w-full space-y-8">
        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-[2.4rem] font-semibold text-gray-900">
            Sign Up
          </h1>
          <p className="text-[1.4rem] text-gray-500">
            Begin your journey with Spoilt by signing up.
          </p>
        </div>

        {/* FORM */}
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
          }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          <Form className="space-y-6">
            {/* FIRST & LAST NAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                name="firstName"
                label="First Name"
                placeholder="Enter your first name"
              />
              <Input
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name"
              />
            </div>

            {/* USERNAME & EMAIL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                name="username"
                label="Username"
                placeholder="Enter your username"
              />
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="example@domain.com"
              />
            </div>

            {/* PASSWORD */}
            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Create your password"
            />

            {/* TERMS */}
            <label className="flex items-start gap-3 text-[1.4rem] text-gray-600">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span>
                I agree to the{" "}
                <Link href="#" className="text-teal-600 hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-teal-600 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* SIGN UP BUTTON */}
            <Button
              type="submit"
              className="w-full h-[4.8rem] text-[1.6rem] font-medium"
            >
              Sign Up
            </Button>

            {/* DIVIDER */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-[1.2rem] text-gray-400">OR</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* CONTINUE WITH GOOGLE */}
            <button
              type="button"
              className="
                w-full
                h-[4.8rem]
                flex
                items-center
                justify-center
                gap-3
                rounded-lg
                border
                border-gray-200
                text-[1.4rem]
                font-medium
                text-gray-700
                hover:bg-gray-50
              "
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
              />
              Continue with Google
            </button>
          </Form>
        </Formik>

        {/* FOOTER */}
        <p className="text-center text-[1.4rem] text-gray-500">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-teal-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </Stack>
    </main>
  );
};

export default SignUp;
