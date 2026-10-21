import { useCallback, useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";

// AAC in MP4 (.m4a) first: it's what the mobile app records and the only
// format that also plays on iPhones. Chrome and Safari can record it; Firefox
// falls back to Opus.
const PREFERRED_TYPES = [
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
];

const pickMimeType = () =>
  typeof MediaRecorder !== "undefined" && typeof MediaRecorder.isTypeSupported === "function"
    ? PREFERRED_TYPES.find((type) => MediaRecorder.isTypeSupported(type))
    : undefined;

// Shorter than this is a tap on the mic, not a voice note.
const MIN_SECONDS = 1;
// Sliding this far left cancels.
const CANCEL_OFFSET = -80;

/** Hold-to-record voice notes with slide-to-cancel. */
export function useRecording(onRecorded: (recording: Blob, durationSeconds: number) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingCancelled, setRecordingCancelled] = useState(false);
  const [slideOffset, setSlideOffset] = useState(0);

  const cancelledRef = useRef(false);
  const startedAtRef = useRef(0);
  const startXRef = useRef(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Latest callback, so stopRecording stays stable while the caller re-renders.
  const onRecordedRef = useRef(onRecorded);
  useEffect(() => {
    onRecordedRef.current = onRecorded;
  }, [onRecorded]);

  const stopRecording = useCallback(
    (send: boolean) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      const recorder = mediaRecorderRef.current;
      mediaRecorderRef.current = null;
      setIsRecording(false);
      setRecordingDuration(0);
      setRecordingCancelled(false);
      setSlideOffset(0);
      if (!recorder) return;

      const seconds = (Date.now() - startedAtRef.current) / 1000;
      recorder.onstop = () => {
        recorder.stream.getTracks().forEach((track) => track.stop());
        if (!send) return;
        if (seconds < MIN_SECONDS) {
          toast("Hold the mic to record a voice note.");
          return;
        }
        const recording = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        if (recording.size > 0) onRecordedRef.current(recording, seconds);
      };
      if (recorder.state !== "inactive") recorder.stop();
      else recorder.onstop?.(new Event("stop"));
    },
    [],
  );

  const startRecording = useCallback(async (clientX: number) => {
    if (mediaRecorderRef.current) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      toast.error("Voice notes aren't supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      startXRef.current = clientX;
      startedAtRef.current = Date.now();
      cancelledRef.current = false;
      setIsRecording(true);
      setRecordingDuration(0);
      setRecordingCancelled(false);
      setSlideOffset(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }, 250);
    } catch {
      toast.error("Allow microphone access in your browser to record voice notes.");
    }
  }, []);

  useEffect(() => {
    if (!isRecording) return;

    const track = (clientX: number) => {
      const offset = clientX - startXRef.current;
      cancelledRef.current = offset < CANCEL_OFFSET;
      setSlideOffset(offset);
      setRecordingCancelled(offset < CANCEL_OFFSET);
    };
    const handleMouseMove = (e: MouseEvent) => track(e.clientX);
    const handleTouchMove = (e: TouchEvent) => track(e.touches[0].clientX);
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

  // Never leave the microphone on after leaving the chat.
  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
      const recorder = mediaRecorderRef.current;
      if (recorder) {
        recorder.onstop = () => recorder.stream.getTracks().forEach((t) => t.stop());
        if (recorder.state !== "inactive") recorder.stop();
      }
    },
    [],
  );

  return {
    isRecording,
    recordingDuration,
    recordingCancelled,
    slideOffset,
    startRecording,
    stopRecording,
  };
}
