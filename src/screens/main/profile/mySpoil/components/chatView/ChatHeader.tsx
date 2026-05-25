import Image from "next/image";

interface Props {
  name: string;
  avatar: string | null;
}

export function ChatHeader({ name, avatar }: Props) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E9EEF2] shrink-0">
      <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#E8EEF2] shrink-0">
        {avatar ? (
          <Image src={avatar} alt={name} fill className="object-cover" />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-sm font-semibold text-[#0B5368]">
            {name[0] ?? "?"}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-[#20262D]">{name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <span className="text-xs text-[#8A98A3]">Online</span>
        </div>
      </div>
    </div>
  );
}
