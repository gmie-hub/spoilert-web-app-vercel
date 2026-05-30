"use client";

import React, { useState } from "react";

import Button from "@spt/components/button";
import Modal from "@spt/components/modal";

interface BuySpoilPaymentModalProps {
  open: boolean;
  onClose: () => void;
  spoilTitle: string;
  costFee: number;
  certificateFee?: number;
  adminCharges?: number;
  vatRate?: number;
  // allow payment handler to return a response (e.g. payment link) if needed
  // callers may return Promise<any> from the handler
  onMakePayment?: () => void | Promise<any>;
  isMakingPayment?: boolean;
}

const formatNaira = (value: number) => {
  return `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

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
}) => {
  const [discountCode, setDiscountCode] = useState("");
  const vatAmount = costFee * vatRate;
  const discount = 0;
  const total = costFee + adminCharges + certificateFee + vatAmount - discount;

  return (
    <Modal open={open} onClose={onClose} title="Payment Summary" size="md">
      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-3">
          <p className="text-[#4B5563]">Spoylz</p>
          <p className="font-medium text-[#1F2937] text-right">{spoilTitle}</p>
        </div>

        <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-3">
          <p className="text-[#4B5563]">Cost Fee</p>
          <p className="font-semibold text-[#1F2937]">{formatNaira(costFee)}</p>
        </div>

        <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-3">
          <p className="text-[#4B5563]">Admin charges</p>
          <p className="font-semibold text-[#1F2937]">{formatNaira(adminCharges)}</p>
        </div>

        <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-3">
          <p className="text-[#4B5563]">Certificate Fee</p>
          <p className="font-semibold text-[#1F2937]">{formatNaira(certificateFee)}</p>
        </div>

        <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-3">
          <p className="text-[#4B5563]">V.A.T ({Math.round(vatRate * 1000) / 10}%)</p>
          <p className="font-semibold text-[#1F2937]">{formatNaira(vatAmount)}</p>
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
            <Button variant="yellow" className="!rounded-xl !px-6 !py-3">
              Redeem
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#E7E7E7] pt-4">
          <p className="text-lg text-[#374151]">Total</p>
          <p className="text-2xl font-bold text-[#111827]">{formatNaira(total)}</p>
        </div>

        <Button
          variant="darkBlue"
          className="w-full !py-4"
          disabled={isMakingPayment}
          onClick={onMakePayment}
        >
          {isMakingPayment ? "Processing..." : "Make Payment"}
        </Button>
      </div>
    </Modal>
  );
};

export default BuySpoilPaymentModal;
