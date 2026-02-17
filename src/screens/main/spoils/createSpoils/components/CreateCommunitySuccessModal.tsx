import { type FC } from "react";

import Image from "next/image";

import ModalGIF from "@spt/assets/images/modal.gif";
import Button from "@spt/components/button";
import Modal from "@spt/components/modal";

interface CreateCommunitySuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateCommunitySuccessModal: FC<CreateCommunitySuccessModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-8">
        <div className="flex justify-center">
          <Image
            src={ModalGIF}
            alt="Create Community Modal"
            width={200}
            height={200}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-medium text-black text-center mt-4">
          Your Community Has Been Scheduled Successfully 🎉
        </h2>

        <p className="text-center">
          Learners can now join and start engaging with you and others
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <Button onClick={onClose}>Okay</Button>
      </div>
    </Modal>
  );
};

export default CreateCommunitySuccessModal;
