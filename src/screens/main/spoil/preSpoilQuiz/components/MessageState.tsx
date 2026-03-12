"use client";

import { InlineMessageCard } from "./InlineMessageCard";

export const MessageState = ({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) => (
  <section className="min-h-screen px-4 py-8 sm:px-6 lg:px-20">
    <div className="mx-auto max-w-[1100px]">
      <InlineMessageCard message={message} tone={tone} />
    </div>
  </section>
);
