"use client";

import { ReactNode } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import FailureIcon from "@spt/assets/icons/close-circle-svgrepo-com (1) 1.svg";
import SuccessIcon from "@spt/assets/icons/done-task-1lwcuCqx7L.svg";
import { Card } from "@spt/components";
import SuccessState from "@spt/components/successState";
import useVerifyPaymentQuery from "@spt/hooks/apiRequests/useVerifyPaymentQuery";

const PaymentVerificationScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tx_ref = searchParams.get("tx_ref");
  const transaction_id = searchParams.get("transaction_id");

  const { isSuccess, isLoading, errorMessage } = useVerifyPaymentQuery({
    tx_ref,
    transaction_id,
  });

  if (!tx_ref || !transaction_id) {
    return (
      <PaymentResultShell>
        <SuccessState
          icon={FailureIcon}
          iconWidth={120}
          iconHeight={120}
          title="Payment Failed"
          description="We couldn't find a payment reference to verify. Please try again or use a different payment method."
          buttonLabel="Try Again"
          onButtonClick={() => router.back()}
          showSecondBtn
          secondBtnLabel="Back to Home"
          onSecondBtnClick={() => router.push("/")}
        />
      </PaymentResultShell>
    );
  }

  if (isLoading) {
    return (
      <PaymentResultShell>
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <span className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-blue-lightest)] border-t-[var(--color-blue)]" />
          <h1 className="text-lg font-semibold text-gray-900">
            Verifying your payment...
          </h1>
          <p className="max-w-sm text-sm text-gray-500">
            Please hold on while we confirm your transaction. This will only take
            a moment.
          </p>
        </div>
      </PaymentResultShell>
    );
  }

  if (isSuccess) {
    return (
      <PaymentResultShell>
        <SuccessState
          icon={SuccessIcon}
          iconWidth={140}
          iconHeight={140}
          title="Payment Successful 🎉"
          description="You've successfully paid for the Spoylz. You can now start learning and access all available content."
          buttonLabel="Go to Spoylz"
          href="/my-learnings"
        />
      </PaymentResultShell>
    );
  }

  return (
    <PaymentResultShell>
      <SuccessState
        icon={FailureIcon}
        iconWidth={120}
        iconHeight={120}
        title="Payment Failed"
        description={
          errorMessage ||
          "We couldn't process your payment at the moment. Please try again or use a different payment method."
        }
        buttonLabel="Try Again"
        onButtonClick={() => router.back()}
        showSecondBtn
        secondBtnLabel="Back to Home"
        onSecondBtnClick={() => router.push("/")}
      />
    </PaymentResultShell>
  );
};

const PaymentResultShell = ({ children }: { children: ReactNode }) => (
  <section className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] px-4 py-10">
    <Card className="max-w-md rounded-2xl bg-white">{children}</Card>
  </section>
);

export default PaymentVerificationScreen;
