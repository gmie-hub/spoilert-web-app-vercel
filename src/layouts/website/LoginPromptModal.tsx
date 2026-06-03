"use client";

import React from "react";

import { useRouter } from "next/navigation";

import Button from "@spt/components/button";
import Modal from "@spt/components/modal";

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
  /** Optional path to send the user to after they choose to log in. */
  redirectTo?: string;
}

const AUTO_CLOSE_MS = 5000;

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  open,
  onClose,
  redirectTo = "/auth/signin",
}) => {
  const router = useRouter();

  // Keep the latest onClose without re-arming the timer on every parent render.
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  // Auto-dismiss the card after 5 seconds while it is open.
  React.useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onCloseRef.current(), AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Please log in to continue
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          You need an account to access this page. This message will close
          automatically in a few seconds.
        </p>

        <Button
          variant="default"
          className="mt-6 w-full rounded-full"
          onClick={() => {
            onClose();
            router.push(redirectTo);
          }}
        >
          Login
        </Button>
      </div>
    </Modal>
  );
};

export default LoginPromptModal;
