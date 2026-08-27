"use client";

import { useCallback, useRef, useState } from "react";

import toast from "react-hot-toast";

import {
  type CreationFailure,
  getApiErrorMessage,
} from "@spt/utils/creationFailures";

/**
 * Tracks the steps that failed while publishing a Spoylz — a module, its
 * lessons, a quiz, its questions, the certificate — so the review screen can
 * list them and re-run them one at a time.
 *
 * A ref backs the list because the publish flow checks it the moment its awaits
 * finish, which is before React has re-rendered with the new state.
 */
export const useCreationFailures = () => {
  const failuresRef = useRef<CreationFailure[]>([]);
  const afterIssuesRef = useRef<(() => void) | null>(null);
  const [failures, setFailures] = useState<CreationFailure[]>([]);
  const [recreatedLabels, setRecreatedLabels] = useState<string[]>([]);
  const [retryingFailureId, setRetryingFailureId] = useState<string | null>(
    null,
  );
  const [isIssuesModalOpen, setIsIssuesModalOpen] = useState(false);

  const syncFailures = (next: CreationFailure[]) => {
    failuresRef.current = next;
    setFailures(next);
  };

  // A step that fails twice replaces its earlier entry instead of stacking up.
  const reportFailure = useCallback((failure: CreationFailure) => {
    syncFailures([
      ...failuresRef.current.filter((item) => item.id !== failure.id),
      failure,
    ]);
  }, []);

  const resetFailures = useCallback(() => {
    syncFailures([]);
    setRecreatedLabels([]);
  }, []);

  /**
   * Runs `onSuccess` when every step worked; otherwise opens the issues modal
   * and holds `onSuccess` until the tutor continues from it.
   */
  const finishCreation = (onSuccess: () => void) => {
    if (failuresRef.current.length === 0) {
      onSuccess();
      return;
    }

    afterIssuesRef.current = onSuccess;
    setIsIssuesModalOpen(true);
  };

  const retryFailure = async (failure: CreationFailure) => {
    setRetryingFailureId(failure.id);

    try {
      await failure.retry();
      syncFailures(failuresRef.current.filter((item) => item.id !== failure.id));
      setRecreatedLabels((previous) => [...previous, failure.label]);
      toast.success(`${failure.label} created`);
    } catch (error) {
      // Keep the row visible, with the newest reason it failed.
      syncFailures(
        failuresRef.current.map((item) =>
          item.id === failure.id
            ? {
                ...item,
                message: getApiErrorMessage(
                  error,
                  "Could not recreate this item",
                ),
              }
            : item,
        ),
      );
    } finally {
      setRetryingFailureId(null);
    }
  };

  const closeIssuesModal = () => {
    setIsIssuesModalOpen(false);

    const continueFlow = afterIssuesRef.current;
    afterIssuesRef.current = null;
    resetFailures();
    continueFlow?.();
  };

  return {
    failures,
    recreatedLabels,
    retryingFailureId,
    isIssuesModalOpen,
    reportFailure,
    resetFailures,
    finishCreation,
    retryFailure,
    closeIssuesModal,
  };
};

export default useCreationFailures;
