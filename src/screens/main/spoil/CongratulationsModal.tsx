"use client";

import React from "react";

import { useRouter } from "next/navigation";

import Button from "@spt/components/button";
import Modal from "@spt/components/modal";

interface CongratulationsModalProps {
  open: boolean;
  onClose: () => void;
  /** Whether this spoil awards a certificate (has_certificate === 1). */
  hasCertificate: boolean;
  spoilId: number | string;
}

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({
  open,
  onClose,
  hasCertificate,
  spoilId,
}) => {
  const router = useRouter();

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5] text-3xl">
          🎉
        </div>

        <h3 className="mt-4 text-xl font-semibold text-gray-900">
          Congratulations!
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          You have successfully completed this lesson.
        </p>

        <div className="mt-6 flex w-full flex-col gap-3">
          {hasCertificate && (
            <Button
              variant="default"
              className="w-full rounded-full"
              onClick={() => {
                onClose();
                router.push(`/my-learnings/certificate/${spoilId}`);
              }}
            >
              View Certificate
            </Button>
          )}

          <Button
            variant={hasCertificate ? "outline" : "default"}
            className="w-full rounded-full"
            onClick={onClose}
          >
            Continue Learning
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CongratulationsModal;
