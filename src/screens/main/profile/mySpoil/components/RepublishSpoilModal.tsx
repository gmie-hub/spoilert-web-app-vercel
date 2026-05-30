"use client";

import { type FC } from "react";

import { RiRocket2Line } from "react-icons/ri";

import Modal from "@spt/components/modal";

interface RepublishSpoilModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const RepublishSpoilModal: FC<RepublishSpoilModalProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EEF7FB] text-[#0B5368]">
          <RiRocket2Line className="text-[58px]" />
        </div>

        <h2 className="mt-6 text-[22px] font-medium text-[#20262D]">
          Republish Spoylz?
        </h2>

        <p className="mt-4 max-w-[440px] text-base leading-7 text-[#667085]">
          Learners will regain access to this Spoylz. Are you sure you want to
          republish
        </p>

        <div className="mt-8 flex w-full flex-col gap-4">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex h-12 w-full items-center justify-center rounded-[14px] bg-[#0B5368] px-6 text-base font-semibold text-white transition hover:bg-[#09485A] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Republishing..." : "Yes, Republish"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex h-12 w-full items-center justify-center rounded-[14px] border border-[#E4E7EC] bg-white px-6 text-base font-semibold text-[#0B5368] transition hover:bg-[#F8FBFD] disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RepublishSpoilModal;
