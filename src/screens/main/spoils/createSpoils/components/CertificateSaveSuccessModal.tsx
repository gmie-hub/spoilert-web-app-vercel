import { type FC } from "react";

import successIcon from "@spt/assets/images/modal.gif";
import Modal from "@spt/components/modal";
import SuccessState from "@spt/components/successState";

interface CertificateSaveSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const CertificateSaveSuccessModal: FC<CertificateSaveSuccessModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Modal open={open} onClose={onClose} size="md" showCloseButton={false}>
      <SuccessState
        title="Certificate Design Has Been Saved Successfully 🎉 "
        // description="Your certificate changes have been saved and are ready for review."
        buttonLabel="Back To Review"
        onButtonClick={onClose}
        className="py-2"
        icon={successIcon}
      />
    </Modal>
  );
};

export default CertificateSaveSuccessModal;
