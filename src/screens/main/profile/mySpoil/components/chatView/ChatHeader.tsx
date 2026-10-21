import type { ReactNode } from "react";

import { ChatAvatar } from "./ChatAvatar";
import { PresenceLabel } from "./PresenceLabel";

interface Props {
  userId: string;
  name: string;
  avatar: string | null;
  online: boolean;
  lastSeen: Date | null;
  activity?: "typing" | "recording" | null;
  /** Shown before the avatar, e.g. a back button on small screens. */
  leading?: ReactNode;
  /** Shown at the far end, e.g. a menu. */
  actions?: ReactNode;
}

export function ChatHeader({
  userId,
  name,
  avatar,
  online,
  lastSeen,
  activity,
  leading,
  actions,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5 sm:py-4 border-b border-[#E9EEF2] shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {leading}
        <ChatAvatar userId={userId} name={name} avatar={avatar} size={44} online={online} />
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#20262D] truncate">{name}</p>
          <PresenceLabel online={online} lastSeen={lastSeen} activity={activity} />
        </div>
      </div>
      {actions}
    </div>
  );
}
