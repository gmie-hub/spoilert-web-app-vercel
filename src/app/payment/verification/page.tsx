"use client";

import { Suspense } from "react";

import PaymentVerificationScreen from "@spt/screens/payment/verification";

const PaymentVerificationPage = () => {
  return (
    <Suspense fallback={null}>
      <PaymentVerificationScreen />
    </Suspense>
  );
};

export default PaymentVerificationPage;
