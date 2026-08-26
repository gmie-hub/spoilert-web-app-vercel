"use client";

import type { FC } from "react";

import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

import Button from "@spt/components/button";
import Modal from "@spt/components/modal";
import type { CreationFailure } from "@spt/utils/creationFailures";

interface CreationIssuesModalProps {
  open: boolean;
  failures: CreationFailure[];
  /** Steps that failed and were recreated from this modal. */
  recreatedLabels: string[];
  retryingFailureId: string | null;
  onRetry: (failure: CreationFailure) => void;
  onContinue: () => void;
}

/**
 * Lists the steps that failed while publishing a Spoylz and offers a button to
 * run each one again. Retrying a step never repeats the ones that already
 * saved, so nothing gets duplicated.
 */
const CreationIssuesModal: FC<CreationIssuesModalProps> = ({
  open,
  failures,
  recreatedLabels,
  retryingFailureId,
  onRetry,
  onContinue,
}) => {
  const hasFailures = failures.length > 0;
  const isRetrying = retryingFailureId !== null;

  return (
    <Modal
      open={open}
      onClose={onContinue}
      title={
        hasFailures
          ? "Some parts of your Spoylz did not save"
          : "Everything has been created"
      }
      description={
        hasFailures
          ? "Your Spoylz itself was created. Recreate the items below — whatever already saved is left untouched."
          : "Every item that failed has been recreated."
      }
      actions={
        <Button
          variant={hasFailures ? "outline" : "darkBlue"}
          onClick={onContinue}
        >
          {hasFailures ? "Continue Anyway" : "Continue"}
        </Button>
      }
    >
      <div className="space-y-3">
        {failures.map((failure) => (
          <div
            key={failure.id}
            className="rounded-[14px] border border-[#F3D5D5] bg-[#FEF6F6] p-4"
          >
            <div className="flex items-start gap-3">
              <FiAlertTriangle
                className="mt-0.5 shrink-0 text-[#D92D20]"
                size={18}
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#212529]">
                  {failure.label}
                </p>
                <p className="mt-1 break-words text-xs text-[#B42318]">
                  {failure.message}
                </p>
              </div>
            </div>

            <Button
              variant="darkBlue"
              disabled={isRetrying}
              onClick={() => onRetry(failure)}
              className={`mt-3 w-full rounded-[12px] py-2.5 text-sm ${
                isRetrying ? "cursor-not-allowed" : ""
              }`}
            >
              {retryingFailureId === failure.id
                ? "Recreating..."
                : failure.actionLabel}
            </Button>
          </div>
        ))}

        {recreatedLabels.map((label) => (
          <p
            key={label}
            className="flex items-center gap-2 rounded-[14px] bg-[#ECFDF5] px-4 py-3 text-sm text-[#065F46]"
          >
            <FiCheckCircle className="shrink-0" size={16} />
            {label} created
          </p>
        ))}
      </div>
    </Modal>
  );
};

export default CreationIssuesModal;
