"use client";

import { useRef, useState } from "react";

import { FiPause, FiPlay } from "react-icons/fi";

import { WAVEFORM, formatDuration } from "./types";

interface Props {
  url: string;
  duration?: number;
  fromMe: boolean;
}

export function AudioPlayer({ url, duration = 0, fromMe }: Props) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  // Recordings carry their length; fall back to the file's own metadata.
  const [length, setLength] = useState(duration);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    }
  };

  const progress = length > 0 ? Math.min(elapsed / length, 1) : 0;
  const played = fromMe ? "bg-[#0B5368]" : "bg-[#5B6A75]";
  const unplayed = fromMe ? "bg-[#0B5368]/40" : "bg-[#8A98A3]/50";

  return (
    <div className="flex items-center gap-2.5 min-w-[180px] max-w-[240px]">
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        onLoadedMetadata={() => {
          const seconds = audioRef.current?.duration;
          if (!duration && seconds && Number.isFinite(seconds)) setLength(Math.round(seconds));
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setElapsed(0);
        }}
        onTimeUpdate={() => setElapsed(audioRef.current?.currentTime ?? 0)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause voice note" : "Play voice note"}
        className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 cursor-pointer ${fromMe ? "bg-[#0B5368]" : "bg-[#8A98A3]"}`}
      >
        {playing ? <FiPause size={14} /> : <FiPlay size={14} />}
      </button>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-end gap-0.5 h-5">
          {WAVEFORM.map((h, i) => (
            <div
              key={i}
              className={`w-0.5 rounded-full ${i / WAVEFORM.length < progress ? played : unplayed}`}
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
        <span className="text-[10px] text-[#8A98A3]">
          {formatDuration(playing || elapsed > 0 ? elapsed : length)}
        </span>
      </div>
    </div>
  );
}
