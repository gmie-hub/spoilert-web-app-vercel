import { FC } from "react";

import Button from "@spt/components/button";
import Modal from "@spt/components/modal";

import type { SchedulePremiereFormState } from "./ScheduleSpoilPremiereModal";

interface CreateScheduledCommunityModalProps {
  open: boolean;
  onClose: () => void;
  onCreateCommunity: () => void;
  onSkip: () => void;
  scheduledDateTime: SchedulePremiereFormState | null;
}

const CreateScheduledCommunityModal: FC<CreateScheduledCommunityModalProps> = ({
  open,
  onClose,
  onCreateCommunity,
  onSkip,
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
    <Modal
      open={open}
      onClose={onClose}
      title="Do you want to create a community for this spoil?"
    >
      <div className="space-y-6">
        <p>
          You can create a community for your learners to ask questions and
          share ideas. This community will remain inactive until the spoil is
          published on{" "}
          <span className="font-medium">{formatScheduledDate()}.</span>
        </p>

        <div className="flex flex-col gap-4">
          <Button onClick={onCreateCommunity}>Create A Community</Button>

          <Button variant="outline" onClick={onSkip}>
            Skip For Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateScheduledCommunityModal;
