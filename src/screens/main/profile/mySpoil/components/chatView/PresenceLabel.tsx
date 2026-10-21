import { formatLastSeen } from "@spt/utils/chat/format";

interface Props {
  online: boolean;
  lastSeen: Date | null;
  /** What they're doing right now, shown instead of their status. */
  activity?: "typing" | "recording" | null;
}

export function PresenceLabel({ online, lastSeen, activity = null }: Props) {
  if (activity) {
    return (
      <div className="flex items-center gap-1.5 mt-0.5" aria-live="polite">
        <span className="flex gap-0.5" aria-hidden>
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-1 h-1 rounded-full bg-[#0B5368] animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </span>
        <span className="text-xs font-medium text-[#0B5368] truncate">
          {activity === "recording" ? "recording audio…" : "typing…"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 mt-0.5">
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${online ? "bg-[#22C55E]" : "bg-[#C4C4C4]"}`}
      />
      <span className="text-xs text-[#8A98A3] truncate">
        {online ? "Online" : formatLastSeen(lastSeen)}
      </span>
    </div>
  );
}
