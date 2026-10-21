import { formatLastSeen } from "@spt/utils/chat/format";

interface Props {
  online: boolean;
  lastSeen: Date | null;
}

export function PresenceLabel({ online, lastSeen }: Props) {
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
