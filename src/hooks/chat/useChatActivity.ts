"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { type ChatActivity, setActivity, subscribeToActivity } from "@spt/utils/chat/activity";

// "typing…" shows for this long after the other person's latest keystroke
// signal; while they keep typing we re-signal well inside it.
const TYPING_SHOW_MS = 4_000;
const TYPING_SIGNAL_EVERY_MS = 2_500;
// Recording is a flag that's cleared when they stop; ignore one left behind
// by an app that closed mid-recording.
const RECORDING_STALE_MS = 5 * 60_000;

/**
 * Watch whether `otherId` is typing or recording in a conversation (judged by
 * when their signal arrives here, so device clocks don't have to agree).
 */
function useOtherActivity(
  activity: ChatActivity,
  conversationId: string | null,
  otherId: string | null,
  showForMs: number,
) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!conversationId || !otherId) return;
    let last: number | null | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsubscribe = subscribeToActivity(activity, conversationId, (lastActive) => {
      const at = lastActive[otherId]?.getTime() ?? null;
      if (at === last) return;
      const isFirstSnapshot = last === undefined;
      last = at;
      clearTimeout(timer);
      if (at == null || (isFirstSnapshot && Date.now() - at > showForMs)) {
        setActive(false);
        return;
      }
      setActive(true);
      timer = setTimeout(() => setActive(false), showForMs);
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
      setActive(false);
    };
  }, [activity, conversationId, otherId, showForMs]);

  return active;
}

/** Live "typing…" / "recording audio…" both ways for one conversation. */
export default function useChatActivity(
  conversationId: string | null,
  meId: string | null,
  otherId: string | null,
) {
  const otherIsTyping = useOtherActivity("typing", conversationId, otherId, TYPING_SHOW_MS);
  const otherIsRecording = useOtherActivity("recording", conversationId, otherId, RECORDING_STALE_MS);

  const lastTypingSignalRef = useRef(0);
  const recordingRef = useRef(false);

  /** Call on every keystroke; signals at most every few seconds. */
  const notifyTyping = useCallback(() => {
    if (!conversationId || !meId) return;
    const now = Date.now();
    if (now - lastTypingSignalRef.current < TYPING_SIGNAL_EVERY_MS) return;
    lastTypingSignalRef.current = now;
    void setActivity("typing", conversationId, meId, true);
  }, [conversationId, meId]);

  /** Call when the message is sent or the input is cleared. */
  const stopTyping = useCallback(() => {
    if (!conversationId || !meId || !lastTypingSignalRef.current) return;
    lastTypingSignalRef.current = 0;
    void setActivity("typing", conversationId, meId, false);
  }, [conversationId, meId]);

  const setRecording = useCallback(
    (recording: boolean) => {
      if (!conversationId || !meId || recordingRef.current === recording) return;
      recordingRef.current = recording;
      void setActivity("recording", conversationId, meId, recording);
    },
    [conversationId, meId],
  );

  // Leaving the chat clears my signals so the other person isn't left with a stale one.
  useEffect(
    () => () => {
      if (!conversationId || !meId) return;
      if (lastTypingSignalRef.current) void setActivity("typing", conversationId, meId, false);
      if (recordingRef.current) void setActivity("recording", conversationId, meId, false);
      lastTypingSignalRef.current = 0;
      recordingRef.current = false;
    },
    [conversationId, meId],
  );

  const otherActivity: ChatActivity | null = otherIsRecording
    ? "recording"
    : otherIsTyping
      ? "typing"
      : null;

  return {
    otherActivity,
    notifyTyping,
    stopTyping,
    setRecording,
  };
}
