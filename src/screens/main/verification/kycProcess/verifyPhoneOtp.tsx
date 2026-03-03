// "use client";

// import { useEffect, useState } from "react";

// import { useRouter } from "next/navigation";

// import NewMessageIcon from "@spt/assets/icons/New message-rafiki 1.svg";
// import OtpVerificationLayout from "@spt/components/OtpVerificationLayout";
// import { useResendOtpMutation } from "@spt/hooks/apiRequests/resendOtpMutation";
// import { useVerifyOtpMutation } from "@spt/hooks/apiRequests/usePhoneVerifyOtpMutation";

// const VerifyPhoneOtp = () => {
//   const router = useRouter();
//   const [phone, setPhone] = useState("+2340000000000"); // default/fallback number
//   const [timer, setTimer] = useState(27);

//   const { resendOtpHandler, isLoading: isResending } = useResendOtpMutation();
//   const { verifyOtpHandler, isLoading: isVerifying } = useVerifyOtpMutation();

//   useEffect(() => {
//     const storedPhone = localStorage.getItem("userPhone");
//     if (storedPhone) setPhone(storedPhone);
//   }, []);

//   // Handle Resend OTP
//   const handleResendOtp = async () => {
//     await resendOtpHandler({ countryCode: "234", phoneNumber: phone }, { setSubmitting: () => {} });
//     setTimer(27);
//   };

//   // Countdown timer
//   useEffect(() => {
//     if (timer <= 0) return;
//     const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
//     return () => clearInterval(interval);
//   }, [timer]);

//   return (
//     <main className="w-full flex justify-start">
//       <div className="w-full px-4 sm:px-8 md:px-8">
//         {/* Close button */}
//         <div className="flex justify-end max-w-md">
//           <button
//             onClick={() => router.push("/auth/signup")}
//             className="text-gray-500 hover:text-gray-800 font-bold text-xl"
//           >
//             ×
//           </button>
//         </div>

//         <div className="max-w-md">
//           <OtpVerificationLayout
//             title="Enter Verification Code"
//             icon={NewMessageIcon}
//             buttonLabel="Verify"
//             isSubmitting={isVerifying}
//             description={
//               <>
//                 A six-digit code has been sent to{" "}
//                 <span className="font-medium text-gray-700">{phone}</span>.
//                 Enter the code to verify your phone number.
//               </>
//             }
//             onSubmit={(code, actions) =>
//               verifyOtpHandler({ otpCode: code }, actions)
//             }
//           />

//           {/* Resend OTP */}
//           <p className="text-sm text-center text-gray-500 pt-5">
//             Didn’t get code?{" "}
//             {timer > 0 ? (
//               <span>
//                 can resend in{" "}
//                 <span className="text-primary font-medium text-[#EEB408]">
//                   00:{timer.toString().padStart(2, "0")}
//                 </span>
//               </span>
//             ) : (
//               <button
//                 type="button"
//                 onClick={handleResendOtp}
//                 disabled={isResending}
//                 className="underline text-[#DA8543] hover:opacity-80 disabled:opacity-50"
//               >
//                 {isResending ? "Resending..." : "Resend Code"}
//               </button>
//             )}
//           </p>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default VerifyPhoneOtp;
"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import NewMessageIcon from "@spt/assets/icons/New message-rafiki 1.svg";
import OtpVerificationLayout from "@spt/components/OtpVerificationLayout";
import { usePhoneResendOtpMutation } from "@spt/hooks/apiRequests/usePhoneResendOtpMutation";
import { useVerifyOtpMutation } from "@spt/hooks/apiRequests/usePhoneVerifyOtpMutation";

interface VerifyPhoneOtpProps {
  onNext: () => void;
}

const VerifyPhoneOtp = ({ onNext }: VerifyPhoneOtpProps) => {
  const router = useRouter();
  const [phone, setPhone] = useState(""); // default/fallback number
  const [timer, setTimer] = useState(27);

  const { resendOtpHandler, isLoading: isResending } =
    usePhoneResendOtpMutation();
  const { verifyOtpHandler, isLoading: isVerifying } = useVerifyOtpMutation();

  useEffect(() => {
    const storedPhone = localStorage.getItem("userPhone");
    if (storedPhone) setPhone(storedPhone);
  }, []);

  // Handle Resend OTP
  const handleResendOtp = async () => {
    await resendOtpHandler({
      setSubmitting: () => {},
    });

    setTimer(27);
  };

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <main className="w-full flex justify-start">
      <div className="w-full px-4 sm:px-8 md:px-8">
        {/* Close button */}
        <div className="flex justify-end max-w-md">
          <button
            onClick={() => router.push("/auth/signup")}
            className="text-gray-500 hover:text-gray-800 font-bold text-xl"
          >
            ×
          </button>
        </div>

        <div className="max-w-md">
          <OtpVerificationLayout
            title="Enter Verification Code"
            icon={NewMessageIcon}
            buttonLabel="Verify"
            isSubmitting={isVerifying}
            description={
              <>
                A six-digit code has been sent to{" "}
                <span className="font-medium text-gray-700">{phone}</span>.
                Enter the code to verify your phone number.
              </>
            }
            onSubmit={async (code, actions) => {
              await verifyOtpHandler(
                { code },
                actions
              );
              onNext(); // Call onNext after successful verification
            }}
          />

          {/* Resend OTP */}
          <p className="text-sm text-center text-gray-500 pt-5">
            Didn’t get code?{" "}
            {timer > 0 ? (
              <span>
                can resend in{" "}
                <span className="text-primary font-medium text-[#EEB408]">
                  00:{timer.toString().padStart(2, "0")}
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="underline text-[#DA8543] hover:opacity-80 disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            )}
          </p>
        </div>
      </div>
    </main>
  );
};

export default VerifyPhoneOtp;
