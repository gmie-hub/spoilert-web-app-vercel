"use client";

import type { FC, JSX } from "react";

import Image from "next/image";

import DeleteIcon from "@spt/assets/icons/delete.svg";
import Button from "@spt/components/button";
import Modal from "@spt/components/modal";

interface DeleteConfirmationModalProps {
  open: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: JSX.Element;
}

const DeleteConfirmationModal: FC<DeleteConfirmationModalProps> = ({
  open,
  title = "Are You Sure You Want To Delete This Item?",
  description = "You won't be able to recover it once it is deleted",
  itemName,
  icon,
  isLoading = false,
  loadingLabel = "Deleting...",
  confirmLabel = "Yes Delete",
  onConfirm,
  onCancel,
}) => {
  const finalTitle = itemName ? title.replace("This Item", itemName) : title;

  return (
    <Modal open={open} onClose={onCancel} size="md">
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="flex h-16 w-16 items-center justify-center">
          <Image
            src={icon ?? DeleteIcon}
            alt="delete"
            width={100}
            height={100}
          />
        </div>

        <p className="text-center text-2xl font-medium text-black">
          {finalTitle}
        </p>

        <p className="text-center text-base text-gray-500">{description}</p>

        <div className="w-full space-y-5 pt-2">
          <Button
            type="button"
            // variant="danger"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full bg-red text-white hover:bg-red-600"
          >
            {isLoading ? loadingLabel : confirmLabel}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
