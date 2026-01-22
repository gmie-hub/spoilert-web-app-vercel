// import SuccessIcon from "@spt/assets/icons/done-task-1lwcuCqx7L.svg";
// import SuccessState from "@spt/components/successState";

// const ResetPasswordSuccessfully = () => {
//   return (
//     <SuccessState
//       icon={SuccessIcon}
//       title="Password Reset Successful 🎉"
//       description="You have successfully reset your password. You can now log in with your new password"
//       buttonLabel="Log In"
//       href="/auth/signin"
//     />
//   );    
// };

// export default ResetPasswordSuccessfully;

"use client";

import StepLayout from "@spt/components/kycLayout";


const SelectCountryStep = () => {
  return (
    <StepLayout
      step={1}
      totalSteps={4}
      title="Select Country"
      description="To begin your verification, select your country"
      buttonLabel="Continue"
      onButtonClick={() => {
        console.log("Continue clicked");
      }}
    >
      {/* Your form content */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Country
        </label>

        <select className="w-full rounded-lg border border-gray-300 px-4 py-3">
          <option value="">Select country</option>
          <option value="NG">Nigeria</option>
          <option value="GH">Ghana</option>
        </select>
      </div>
    </StepLayout>
  );
};

export default SelectCountryStep;
