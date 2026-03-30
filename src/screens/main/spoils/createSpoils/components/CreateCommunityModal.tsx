import React, { type FC } from "react";

import Image from "next/image";

import ModalGIF from "@spt/assets/images/modal.gif";
import Button from "@spt/components/button";
import Modal from "@spt/components/modal";

interface CreateCommunityModalProps {
  open: boolean;
  onClose: () => void;
  onOkay?: () => void;
  isLoading?: boolean;
}

const CreateCommunityModal: FC<CreateCommunityModalProps> = ({
  open,
  onClose,
  onOkay,
  isLoading = false,
}) => {
  const handleOkayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOkay) {
      onOkay();
    } else {
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-6">
        <div className="flex justify-center">
          <Image
            src={ModalGIF}
            alt="Create Community Modal"
            width={200}
            height={200}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-medium text-black text-center mt-4">
          Do you want to create a community for this spoil?
        </h2>

        <p className="text-center">
          You can create a community for your learners to ask questions and
          share ideas.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <Button onClick={handleOkayClick} disabled={isLoading}>
          {isLoading ? "Creating..." : "Okay"}
        </Button>
      </div>
    </Modal>
  );
};

export default CreateCommunityModal;
