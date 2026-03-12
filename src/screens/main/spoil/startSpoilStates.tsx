"use client";

export const LoadingState = () => (
  <section className="min-h-screen bg-[#FAFAFA] px-4 py-8 sm:px-6 lg:px-20">
    <div className="mx-auto max-w-[1280px]">
      <div className="h-6 w-72 animate-pulse rounded bg-gray-200" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="h-[640px] animate-pulse rounded-[24px] bg-white" />
        <div className="h-[640px] animate-pulse rounded-[24px] bg-white" />
      </div>
    </div>
  </section>
);

export const MessageState = ({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) => (
  <section className="min-h-screen bg-[#FAFAFA] px-4 py-8 sm:px-6 lg:px-20">
    <div className="mx-auto max-w-[1280px]">
      <div
        className={`rounded-[24px] border px-6 py-5 ${
          tone === "error"
            ? "border-red-100 bg-red-50 text-red-700"
            : "border-[#E5E7EB] bg-white text-[#4B5563]"
        }`}
      >
        {message}
      </div>
    </div>
  </section>
);
