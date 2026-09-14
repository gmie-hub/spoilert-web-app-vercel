"use client";

import { useRef, useState } from "react";

import { Card } from "@spt/components";
import Button from "@spt/components/button";

const OtpStep = ({
  title,
  description,
  onSubmit,
}: {
  title: string;
  description: string;
  onSubmit: () => void;
}) => {
  const [code, setCode] = useState("");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "");
    if (!digit) return;

    const next = (code.padEnd(6, " ").substring(0, index) + digit + code.substring(index + 1))
      .replace(/\s/g, "")
      .slice(0, 6);
    setCode(next);
    if (index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const chars = code.padEnd(6, " ").split("");
      chars[index] = " ";
      setCode(chars.join("").replace(/\s/g, ""));
      if (index > 0) inputs.current[index - 1]?.focus();
    }
  };

  return (
    <main className="w-full bg-white">
      <Card className="mx-auto my-10 w-full max-w-[648px] rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10 sm:my-14">
        <h1 className="text-center text-2xl font-semibold text-[#212529] sm:text-[28px]">
          {title}
        </h1>
        <p className="mx-auto mt-2 max-w-[420px] text-center text-sm text-[#6B7280]">
          {description}
        </p>

        <div className="mt-8 flex justify-center gap-2 sm:gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={code[index] || ""}
              aria-label={`Digit ${index + 1}`}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-12 w-11 rounded-xl border border-gray-200 bg-[#FBFBFB] text-center text-lg font-semibold outline-none focus:border-[var(--color-blue)] sm:h-14 sm:w-12"
            />
          ))}
        </div>

        <Button
          type="button"
          className="mt-8 w-full"
          disabled={code.length !== 6}
          onClick={onSubmit}
        >
          Continue
        </Button>
      </Card>
    </main>
  );
};

export default OtpStep;
