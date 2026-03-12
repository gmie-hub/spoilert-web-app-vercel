"use client";

export const LoadingState = () => (
  <section className="min-h-screen px-4 py-8 sm:px-6 lg:px-20">
    <div className="mx-auto max-w-[1100px]">
      <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
      <div className="mx-auto mt-8 max-w-[650px]">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 rounded-3xl border border-[#E7E7E7] p-6">
          <div className="mx-auto h-24 w-24 animate-pulse rounded-full bg-gray-100" />
          <div className="mt-8 h-20 animate-pulse rounded bg-gray-100" />
          <div className="mt-8 space-y-4">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-36 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-44 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="mt-10 h-12 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    </div>
  </section>
);
