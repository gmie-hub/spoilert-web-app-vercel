import { useEffect, useRef } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

const OtpInput = ({ length = 6, value, onChange }: OtpInputProps) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, inputValue: string) => {
    const val = inputValue.replace(/\D/g, "");
    if (!val) return;

    const newValue =
      value.substring(0, index) + val + value.substring(index + 1);

    onChange(newValue);

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (!value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace") handleBackspace(index);
          }}
          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      ))}
    </div>
  );
};

export default OtpInput;
