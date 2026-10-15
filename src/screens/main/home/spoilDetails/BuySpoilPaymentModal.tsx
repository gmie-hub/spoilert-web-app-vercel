"use client";

import React, { useState } from "react";

import Button from "@spt/components/button";
import Modal from "@spt/components/modal";
import useRedeemSponsorshipMutation from "@spt/hooks/apiRequests/useRedeemSponsorshipMutation";
import type { ChargesBreakdown } from "@spt/utils/spoils";

export interface RedeemedSpoil {
  id: number;
  title: string;
  cover_image_url?: string | null;
}

interface BuySpoilPaymentModalProps {
  open: boolean;
  onClose: () => void;
  spoilTitle: string;
  costFee: number;
  certificateFee?: number;
  adminCharges?: number;
  vatRate?: number;
  // navigates to the payment gateway link returned by the endpoint
  onMakePayment?: () => void | Promise<any>;
  isMakingPayment?: boolean;
  // response data returned by the buy-spoil endpoint
  paymentData?: any;
  // fee breakdown from the spoil details endpoint, shown before paymentData arrives
  chargesBreakdown?: ChargesBreakdown | null;
  // fired when a sponsorship code is redeemed successfully
  onRedeemSuccess?: (spoil: RedeemedSpoil) => void;
}

const formatNaira = (value: number) => {
  return `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const AmountSkeleton = ({ className = "h-5 w-24" }: { className?: string }) => (
  <span
    aria-hidden
    className={`inline-block animate-pulse rounded bg-gray-100 align-middle ${className}`}
  />
);

const BuySpoilPaymentModal: React.FC<BuySpoilPaymentModalProps> = ({
  open,
  onClose,
  spoilTitle,
  costFee,
  certificateFee = 0,
  adminCharges = 1000,
  vatRate = 0.075,
  onMakePayment,
  isMakingPayment = false,
  paymentData,
  chargesBreakdown,
  onRedeemSuccess,
}) => {
  const [discountCode, setDiscountCode] = useState("");
  const discount = 0;

  const { redeemSponsorshipHandler, isLoading: isRedeeming } =
    useRedeemSponsorshipMutation();

  const trimmedCode = discountCode.trim();
  const canRedeem = trimmedCode.length > 0 && !isRedeeming;

  const handleRedeem = async () => {
    const response = await redeemSponsorshipHandler(trimmedCode);
    if (!response) return;

    setDiscountCode("");

    // the redeemed spoil is nested under data.sponsorship.spoil
    const redeemedSpoil = response?.data?.sponsorship?.spoil;
    if (redeemedSpoil?.id) {
      onRedeemSuccess?.({
        id: redeemedSpoil.id,
        title: redeemedSpoil.title,
        cover_image_url: redeemedSpoil.cover_image_url,
      });
    }
  };

  const payment = paymentData?.payment;
  const paymentLink = payment?.payment_link;
  const paymentReference = payment?.reference ?? payment?.tx_ref;
  const isGatewayReady = Boolean(paymentLink);
  // the spoil's charges_breakdown lets the real amounts render immediately;
  // without it, amounts stay as skeletons until the buy endpoint responds so
  // the user never sees the prop-based estimate flip to the backend's figures
  const isSummaryReady = Boolean(paymentData || chargesBreakdown);

  // prefer the fees returned by the buy endpoint, then the spoil's
  // charges_breakdown; fall back to prop-based calc
  const charges = payment?.charges ?? chargesBreakdown;
  const costFeeValue = Number(charges?.net_amount ?? costFee);
  const adminChargesValue = Number(charges?.admin_charge ?? adminCharges);
  const certificateFeeValue = Number(charges?.certificate_fee ?? certificateFee);
  const vatAmount = Number(charges?.tax_amount ?? costFee * vatRate);
  const total = Number(
    payment?.amount ??
      charges?.total_amount ??
      costFeeValue + adminChargesValue + certificateFeeValue + vatAmount - discount,
  );
  const vatPercentLabel = costFeeValue
    ? Math.round((vatAmount / costFeeValue) * 1000) / 10
    : Math.round(vatRate * 1000) / 10;

  return (
    <Modal open={open} onClose={onClose} title="Payment Summary" size="md">
      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-3">
          <p className="text-[#4B5563]">Spoylz</p>
          <p className="font-medium text-[#1F2937] text-right">{spoilTitle}</p>
        </div>

        <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-3">
          <p className="text-[#4B5563]">Cost Fee</p>
          <p className="font-semibold text-[#1F2937]">
            {isSummaryReady ? formatNaira(costFeeValue) : <AmountSkeleton />}
          </p>
        </div>

        <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-3">
          <p className="text-[#4B5563]">Admin charges</p>
          <p className="font-semibold text-[#1F2937]">
            {isSummaryReady ? formatNaira(adminChargesValue) : <AmountSkeleton />}
          </p>
        </div>

        <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-3">
          <p className="text-[#4B5563]">Certificate Fee</p>
          <p className="font-semibold text-[#1F2937]">
            {isSummaryReady ? formatNaira(certificateFeeValue) : <AmountSkeleton />}
          </p>
        </div>

        <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-3">
          <p className="text-[#4B5563]">
            V.A.T (
            {isSummaryReady ? `${vatPercentLabel}%` : <AmountSkeleton className="h-4 w-8" />}
            )
          </p>
          <p className="font-semibold text-[#1F2937]">
            {isSummaryReady ? formatNaira(vatAmount) : <AmountSkeleton />}
          </p>
        </div>

        <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-3">
          <p className="text-[#4B5563]">Discount</p>
          <p className="font-semibold text-[#1F2937]">{formatNaira(discount)}</p>
        </div>

        <div>
          <p className="text-[#111827] font-medium">Enter Code</p>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(event) => setDiscountCode(event.target.value)}
              placeholder="Enter sponsorship or discount code"
              className="h-12 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#1F2937] outline-none focus:border-[#9CA3AF]"
            />
            <Button
              variant="yellow"
              className="!rounded-xl !px-6 !py-3 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canRedeem}
              onClick={handleRedeem}
            >
              {isRedeeming ? "Redeeming..." : "Redeem"}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#E7E7E7] pt-4">
          <p className="text-lg text-[#374151]">Total</p>
          <p className="text-2xl font-bold text-[#111827]">
            {isSummaryReady ? formatNaira(total) : <AmountSkeleton className="h-8 w-32" />}
          </p>
        </div>

        {paymentReference && (
          <div className="flex items-center justify-between rounded-xl bg-[#F9FAFB] px-4 py-3">
            <p className="text-[#4B5563]">Payment Reference</p>
            <p className="font-medium text-[#1F2937]">{paymentReference}</p>
          </div>
        )}

        <Button
          variant="darkBlue"
          className="w-full !py-4"
          disabled={isMakingPayment || !isGatewayReady}
          onClick={onMakePayment}
        >
          {isMakingPayment
            ? "Initializing payment..."
            : isGatewayReady
              ? "Make Payment"
              : "Preparing payment..."}
        </Button>
      </div>
    </Modal>
  );
};

export default BuySpoilPaymentModal;
