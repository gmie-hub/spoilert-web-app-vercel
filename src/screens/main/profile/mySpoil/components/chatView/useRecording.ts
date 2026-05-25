import { useCallback, useEffect, useRef, useState } from "react";

import { getTime } from "./types";

import type { ChatMessage } from "./types";

export function useRecording(
  addMessage: (msg: ChatMessage) => void,
  scrollToEnd: () => void,
) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingCancelled, setRecordingCancelled] = useState(false);
  const [slideOffset, setSlideOffset] = useState(0);

  const cancelledRef = useRef(false);
  const durationRef = useRef(0);
  const startXRef = useRef(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopRecording = useCallback(
    (send: boolean) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        setIsRecording(false);
        return;
      }
      recorder.stream.getTracks().forEach((t) => t.stop());
      if (send) {
        const duration = durationRef.current;
        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          addMessage({
            id: Date.now(),
            type: "audio",
            audioUrl: URL.createObjectURL(blob),
            audioDuration: duration,
            fromMe: true,
            time: getTime(),
          });
          scrollToEnd();
        };
      }
      recorder.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
      setRecordingDuration(0);
      setRecordingCancelled(false);
      setSlideOffset(0);
    },
    [addMessage, scrollToEnd],
  );

  const startRecording = useCallback(async (clientX: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      startXRef.current = clientX;
      cancelledRef.current = false;
      durationRef.current = 0;
      setIsRecording(true);
      setRecordingDuration(0);
      setRecordingCancelled(false);
      setSlideOffset(0);
      timerRef.current = setInterval(() => {
        durationRef.current += 1;
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      // Mic permission denied or unavailable
    }
  }, []);

  useEffect(() => {
    if (!isRecording) return;

    const handleMouseMove = (e: MouseEvent) => {
      const offset = e.clientX - startXRef.current;
      cancelledRef.current = offset < -80;
      setSlideOffset(offset);
      setRecordingCancelled(offset < -80);
    };
    const handleTouchMove = (e: TouchEvent) => {
      const offset = e.touches[0].clientX - startXRef.current;
      cancelledRef.current = offset < -80;
      setSlideOffset(offset);
      setRecordingCancelled(offset < -80);
    };
    const handleEnd = () => stopRecording(!cancelledRef.current);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleEnd);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isRecording, stopRecording]);

  return {
    isRecording,
    recordingDuration,
    recordingCancelled,
    slideOffset,
    startRecording,
    stopRecording,
  };
}
