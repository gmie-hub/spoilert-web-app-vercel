import Image from "next/image";

import { getAvatarColor, getInitials } from "@spt/utils/chat/format";

interface Props {
  userId: string;
  name: string;
  avatar?: string | null;
  size?: number;
  online?: boolean;
}

/** A person's photo, or their initials on their colour, with an online dot. */
export function ChatAvatar({ userId, name, avatar, size = 40, online = false }: Props) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-semibold"
        style={{ backgroundColor: getAvatarColor(userId) }}
      >
        {avatar ? (
          // Avatars come from several hosts; skip the optimizer's allow-list.
          <Image src={avatar} alt={name} fill unoptimized className="object-cover" />
        ) : (
          getInitials(name)
        )}
      </div>
      {online && (
        <span
          className="absolute bottom-0 right-0 rounded-full bg-[#22C55E] border-2 border-white"
          style={{ width: Math.max(9, size / 4), height: Math.max(9, size / 4) }}
        />
      )}
    </div>
  );
}
