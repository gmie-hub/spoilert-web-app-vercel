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
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      void audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-2.5 min-w-[180px] max-w-[240px]">
      <audio
        ref={audioRef}
        src={url}
        onEnded={() => {
          setPlaying(false);
          setElapsed(0);
        }}
        onTimeUpdate={() =>
          setElapsed(Math.floor(audioRef.current?.currentTime ?? 0))
        }
      />
      <button
        type="button"
        onClick={toggle}
        className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 ${fromMe ? "bg-[#0B5368]" : "bg-[#8A98A3]"}`}
      >
        {playing ? <FiPause size={14} /> : <FiPlay size={14} />}
      </button>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-end gap-0.5 h-5">
          {WAVEFORM.map((h, i) => (
            <div
              key={i}
              className={`w-0.5 rounded-full ${fromMe ? "bg-[#0B5368]/60" : "bg-[#8A98A3]/60"}`}
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
        <span className="text-[10px] text-[#8A98A3]">
          {formatDuration(playing ? elapsed : duration)}
        </span>
      </div>
    </div>
  );
}
