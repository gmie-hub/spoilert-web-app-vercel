"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import toast from "react-hot-toast";

import type { ChatMessage } from "@spt/screens/main/profile/mySpoil/components/chatView/types";
import { newMessageId, sendChatMessage, uploadChatMedia } from "@spt/utils/chat/chatService";
import { formatFileSize } from "@spt/utils/chat/format";
import type { ChatMessageKind, ChatParticipant } from "@spt/utils/chat/types";

export type MediaKind = Exclude<ChatMessageKind, "text">;

// Same ceilings as the mobile FileValidator.
const MAX_BYTES: Record<MediaKind, number> = {
  image: 10 * 1024 * 1024,
  video: 50 * 1024 * 1024,
  audio: 25 * 1024 * 1024,
  document: 20 * 1024 * 1024,
};

const KIND_LABEL: Record<MediaKind, string> = {
  image: "Images",
  video: "Videos",
  audio: "Voice notes",
  document: "Documents",
};

interface PendingUpload {
  id: string;
  conversationId: string;
  sender: ChatParticipant;
  recipientId: string;
  kind: MediaKind;
  file: Blob;
  fileName: string;
  duration?: number;
  previewUrl: string;
  progress: number;
  failed: boolean;
  sentAt: Date;
}

export interface UploadRequest {
  conversationId: string;
  sender: ChatParticipant;
  recipientId: string;
  kind: MediaKind;
  file: Blob;
  fileName: string;
  duration?: number;
}

/** Length in whole seconds of a video, read from its metadata. */
const readVideoDuration = (file: Blob) =>
  new Promise<number | undefined>((resolve) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    const done = (seconds?: number) => {
      URL.revokeObjectURL(url);
      resolve(seconds);
    };
    video.preload = "metadata";
    video.onloadedmetadata = () =>
      done(Number.isFinite(video.duration) ? Math.round(video.duration) : undefined);
    video.onerror = () => done(undefined);
    video.src = url;
  });

/**
 * Files on their way up. Each shows in the thread with its progress until the
 * real message (written under the same id once the upload finishes) arrives
 * from Firestore, so the other person never sees a message without its file.
 */
export default function useMediaUploads(conversationId: string | null, deliveredIds: Set<string>) {
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const pendingRef = useRef(pending);
  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  const patch = useCallback(
    (id: string, changes: Partial<PendingUpload>) =>
      setPending((list) => list.map((item) => (item.id === id ? { ...item, ...changes } : item))),
    [],
  );

  const run = useCallback(
    async (item: PendingUpload) => {
      try {
        const mediaUrl = await uploadChatMedia({
          conversationId: item.conversationId,
          messageId: item.id,
          file: item.file,
          kind: item.kind,
          fileName: item.fileName,
          onProgress: (progress) => patch(item.id, { progress }),
        });
        await sendChatMessage({
          conversationId: item.conversationId,
          sender: item.sender,
          recipientId: item.recipientId,
          messageId: item.id,
          message: {
            type: item.kind,
            mediaUrl,
            fileName: item.fileName,
            fileSize: item.file.size,
            duration: item.duration,
          },
        });
      } catch {
        patch(item.id, { failed: true });
        toast.error(`Couldn't send ${item.fileName}. Check your connection and try again.`);
      }
    },
    [patch],
  );

  const send = useCallback(
    async (request: UploadRequest) => {
      if (request.file.size > MAX_BYTES[request.kind]) {
        toast.error(
          `${KIND_LABEL[request.kind]} must be ${formatFileSize(MAX_BYTES[request.kind])} or smaller.`,
        );
        return;
      }
      const item: PendingUpload = {
        ...request,
        id: newMessageId(request.conversationId),
        duration:
          request.duration ??
          (request.kind === "video" ? await readVideoDuration(request.file) : undefined),
        previewUrl: URL.createObjectURL(request.file),
        progress: 0,
        failed: false,
        sentAt: new Date(),
      };
      setPending((list) => [...list, item]);
      void run(item);
    },
    [run],
  );

  const retry = useCallback(
    (id: string) => {
      const item = pendingRef.current.find((upload) => upload.id === id);
      if (!item) return;
      patch(id, { failed: false, progress: 0 });
      void run({ ...item, failed: false, progress: 0 });
    },
    [patch, run],
  );

  const dismiss = useCallback((id: string) => {
    setPending((list) => {
      list.filter((item) => item.id === id).forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return list.filter((item) => item.id !== id);
    });
  }, []);

  // Done once Firestore has the message.
  useEffect(() => {
    setPending((list) => {
      const delivered = list.filter((item) => deliveredIds.has(item.id));
      if (!delivered.length) return list;
      delivered.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return list.filter((item) => !deliveredIds.has(item.id));
    });
  }, [deliveredIds]);

  useEffect(
    () => () => pendingRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl)),
    [],
  );

  const pendingMessages = useMemo<ChatMessage[]>(
    () =>
      pending
        .filter((item) => item.conversationId === conversationId && !deliveredIds.has(item.id))
        .map((item) => ({
          id: item.id,
          type: item.kind,
          mediaUrl: item.previewUrl,
          fileName: item.fileName,
          fileSize: item.file.size,
          duration: item.duration,
          fromMe: true,
          sentAt: item.sentAt,
          status: item.failed ? "failed" : "sending",
          uploadProgress: item.progress,
        })),
    [pending, conversationId, deliveredIds],
  );

  return { send, retry, dismiss, pendingMessages };
}
