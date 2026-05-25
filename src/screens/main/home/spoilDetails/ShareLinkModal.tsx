"use client";

import { type FC, useState } from "react";

import { FiCopy } from "react-icons/fi";

import Button from "@spt/components/button";
import Modal from "@spt/components/modal";

interface ShareLinkModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

const ShareLinkModal: FC<ShareLinkModalProps> = ({ open, onClose, url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Share Link" size="sm">
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={url}
          className="h-11 min-w-0 flex-1 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 text-sm text-[#6B7280] outline-none"
        />
        <Button
          variant="yellow"
          className="shrink-0 !rounded-xl !px-4 !py-2.5 text-sm"
          onClick={handleCopy}
        >
          <FiCopy className="text-base" />
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </div>
    </Modal>
  );
};

export default ShareLinkModal;
