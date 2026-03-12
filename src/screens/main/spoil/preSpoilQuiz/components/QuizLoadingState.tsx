"use client";

export const QuizLoadingState = ({ title }: { title: string }) => (
  <div className="mx-auto mt-10 max-w-[650px]">
    <h1 className="text-lg font-semibold text-black sm:text-xl">{title}</h1>

    <div className="mt-6 rounded-[20px] border border-[#E8E8E8] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="flex gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-11 w-11 animate-pulse rounded-xl bg-[#D8EEF6]"
          />
        ))}
      </div>

      <div className="mt-8 h-5 w-32 animate-pulse rounded bg-gray-100" />
      <div className="mt-4 h-16 animate-pulse rounded-2xl bg-[#DFF1F7]" />
      <div className="mt-6 space-y-4">
        <div className="h-16 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-16 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-16 animate-pulse rounded-2xl bg-gray-100" />
      </div>
      <div className="mt-8 h-12 animate-pulse rounded-2xl bg-gray-200" />
    </div>
  </div>
);
