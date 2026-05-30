import { FC } from "react";

import Image from "next/image";

import ModalGIF from "@spt/assets/images/modal.gif";
import Button from "@spt/components/button";
import Modal from "@spt/components/modal";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onCreateCommunity?: () => void;
  onSkip?: () => void;
}

const ReviewModal: FC<ReviewModalProps> = ({
  open,
  onClose,
  onCreateCommunity,
  onSkip,
}) => {
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

        <div className="space-y-2">
          <h2 className="text-xl font-medium text-black mt-2 text-center">
            Your spoil has been submitted for review. Once approved, it will go
            live on the platform🎉
          </h2>

          <h5 className="text-lg font-medium text-black text-center">
            Do you want to create a community for this Spoylz?
          </h5>

          <p className="text-center">
            You can create a community for your learners to ask questions and
            share ideas. If you skip this step, you can create a community later
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <Button onClick={onCreateCommunity}>Create A Community</Button>

          <Button variant="outline" onClick={onSkip || onClose}>
            Skip For Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewModal;
