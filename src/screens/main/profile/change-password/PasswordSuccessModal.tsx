"use client";

import React from "react";

import successIcon from "@spt/assets/images/modal.gif";

import Modal from "@spt/components/modal";
import SuccessState from "@spt/components/successState";

export default function PasswordSuccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="py-8 px-2">
        <SuccessState
          icon={successIcon}
          iconWidth={90}
          iconHeight={90}
          title={"Password Changed Successfully🎉"}
          buttonLabel="Okay"
          onButtonClick={onClose}
        />
      </div>
    </Modal>
  );
}
