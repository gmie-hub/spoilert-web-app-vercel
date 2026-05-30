import { type FC } from "react";

import Image from "next/image";

import ModalGIF from "@spt/assets/images/modal.gif";
import Button from "@spt/components/button";
import Modal from "@spt/components/modal";

import type { SchedulePremiereFormState } from "./ScheduleSpoilPremiereModal";

interface SpoilScheduledModalProps {
  open: boolean;
  onClose: () => void;
  scheduledDateTime?: SchedulePremiereFormState | null;
}

const SpoilScheduledModal: FC<SpoilScheduledModalProps> = ({
  open,
  onClose,
  scheduledDateTime,
}) => {
  const formatScheduledDate = () => {
    if (!scheduledDateTime?.date || !scheduledDateTime?.time) {
      return "the scheduled date";
    }

    const date = new Date(
      `${scheduledDateTime.date}T${scheduledDateTime.time}`,
    );
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

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
          Your Spoylz Has Been Scheduled Successfully 🎉
        </h2>

        <p className="text-center">
          Your Spoylz has been successfully scheduled to go live on{" "}
          <span className="font-medium text-black">
            {formatScheduledDate()}.
          </span>{" "}
          It will be reviewed by the admin before the scheduled time. Once
          approved, it will go live as planned. You can still make changes
          before it’s approved.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <Button
          onClick={() => {
            try {
              if (typeof window !== "undefined") {
                localStorage.removeItem("advanced-spoil-draft");
                sessionStorage.removeItem("advanced-spoil-draft");
              }
            } catch  {
              // ignore errors
            }
            onClose();
          }}
        >
          Okay
        </Button>
      </div>
    </Modal>
  );
};

export default SpoilScheduledModal;
