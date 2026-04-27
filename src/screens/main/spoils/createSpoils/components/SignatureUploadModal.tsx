import { ChangeEvent, RefObject } from "react";

import Image from "next/image";

import documentUploadIcon from "@spt/assets/icons/document-upload.svg";
import saveIcon from "@spt/assets/icons/save.svg";
import Button from "@spt/components/button";
import Modal from "@spt/components/modal";

interface SignatureUploadModalProps {
  open: boolean;
  signatureDraft: string | null;
  signatureInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onClear: () => void;
  onSave: () => void;
}

export default function SignatureUploadModal({
  open,
  signatureDraft,
  signatureInputRef,
  onFileChange,
  onClose,
  onClear,
  onSave,
}: SignatureUploadModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Signature"
      description="Upload an image signature and apply it to this certificate preview."
      size="md"
    >
      <input
        ref={signatureInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      <div className="rounded-2xl min-h-[140px] border-none bg-[#F7F7F7] p-5 text-center">
        {signatureDraft ? (
          <Image
            src={signatureDraft}
            alt="Signature preview"
            className="mx-auto h-24 w-auto max-w-full object-contain"
          />
        ) : (
          <p className="text-sm text-[#667085]">No signature uploaded yet.</p>
        )}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {signatureDraft ? (
            <Button
              variant="outline"
              className="rounded-xl border-[#F1CDCD] px-5 text-[#D14343] hover:bg-white"
              onClick={onClear}
            >
              Remove
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          className="rounded-xl border-[#D7DCE0] px-5 text-[#0B5368]"
          onClick={() => signatureInputRef.current?.click()}
        >
          <Image
            src={documentUploadIcon.src}
            alt="Upload"
            width={16}
            height={16}
          />
          {signatureDraft ? "Replace" : "Upload"}
        </Button>

        <Button variant="darkBlue" className="rounded-xl px-5" onClick={onSave}>
          <Image src={saveIcon.src} alt="Save" width={16} height={16} />
          Save
        </Button>
      </div>
    </Modal>
  );
}
