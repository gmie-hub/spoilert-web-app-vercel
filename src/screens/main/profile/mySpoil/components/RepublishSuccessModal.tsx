"use client";

import { type FC } from "react";

import { FiCheckCircle } from "react-icons/fi";

import Modal from "@spt/components/modal";

interface RepublishSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const RepublishSuccessModal: FC<RepublishSuccessModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      showCloseButton={false}
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#ECFDF3] text-[#12B76A]">
          <FiCheckCircle className="text-[56px]" />
        </div>

        <h2 className="mt-6 text-[22px] font-medium text-[#20262D]">
          Spoylz Republished Successfully
        </h2>

        <p className="mt-4 max-w-[420px] text-base leading-7 text-[#667085]">
          Your Spoylz has been sent for review and learners will regain access
          once it is approved.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-[14px] bg-[#0B5368] px-6 text-base font-semibold text-white transition hover:bg-[#09485A]"
        >
          Okay
        </button>
      </div>
    </Modal>
  );
};

export default RepublishSuccessModal;
