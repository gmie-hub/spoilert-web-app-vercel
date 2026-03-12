"use client";

export const InlineMessageCard = ({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) => (
  <div
    className={`rounded-2xl border p-6 ${
      tone === "error"
        ? "border-red-100 bg-red-50 text-red-700"
        : "border-gray-200 bg-white text-gray-600"
    }`}
  >
    {message}
  </div>
);
