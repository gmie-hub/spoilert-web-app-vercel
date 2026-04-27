interface Props {
  name: string;
}

export function EmptyState({ name }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
      <div className="relative flex items-end justify-center w-24 h-24">
        <div className="absolute bottom-0 w-20 h-20 rounded-full bg-[#F3F4F6]" />
        <div className="relative z-10 mb-4 w-14 h-16 rounded-xl bg-[#0B5368] flex flex-col justify-center gap-2 p-3 shadow-md">
          <div className="w-full h-2 bg-white/80 rounded-full" />
          <div className="w-full h-1.5 bg-white/50 rounded-full" />
          <div className="w-3/4 h-1.5 bg-white/50 rounded-full" />
        </div>
      </div>
      <p className="text-base font-semibold text-[#20262D]">Start A conversation</p>
      <p className="text-sm text-[#8A98A3] text-center max-w-[280px] leading-relaxed">
        This is the beginning of your conversation with {name}
      </p>
    </div>
  );
}
