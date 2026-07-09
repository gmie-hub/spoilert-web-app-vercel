"use client";

import React from "react";

import { FiCheck } from "react-icons/fi";

import Button from "@spt/components/button";
import Modal from "@spt/components/modal";

import type { RedeemedSpoil } from "./BuySpoilPaymentModal";

interface RedeemSuccessModalProps {
  open: boolean;
  onClose: () => void;
  spoil: RedeemedSpoil | null;
  onViewSpoil: () => void;
}

const RedeemSuccessModal: React.FC<RedeemSuccessModalProps> = ({
  open,
  onClose,
  spoil,
  onViewSpoil,
}) => {
  return (
    <Modal open={open} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAFFEF]">
          <FiCheck className="h-8 w-8 text-[#1CC8A5]" />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-[#111827]">
          Spoil redeemed successfully
        </h3>

        <p className="mt-2 text-sm text-[#6B7280]">
          {spoil?.title
            ? `“${spoil.title}” has been added to your learnings.`
            : "The spoil has been added to your learnings."}
        </p>

        <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="darkBlue"
            className="w-full"
            onClick={onViewSpoil}
          >
            View Spoil
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RedeemSuccessModal;
