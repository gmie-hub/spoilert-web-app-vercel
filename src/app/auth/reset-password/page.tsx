"use client";
import { Suspense } from "react";

import ResetPasswordPage from "@spt/screens/auth/resetPassword";

const ResetPassword = () => {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default ResetPassword;