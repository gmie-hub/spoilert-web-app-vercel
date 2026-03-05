"use client";

import type { FC } from "react";

import { useField } from "formik";
import Image from "next/image";
import { FiPlusCircle } from "react-icons/fi";

import TrashIcon from "@spt/assets/icons/trash.svg";
import Button from "@spt/components/button";

import {
  MULTIPLE_CHOICE_MAX_OPTIONS,
  MULTIPLE_CHOICE_MIN_OPTIONS,
} from "../questionHelpers";

import type { QuizQuestionOption } from "../types";

interface QuestionOptionsEditorProps {
  error?: string;
  onAddOption: () => void;
  onRemoveOption: (optionId: string) => void;
  onToggleCorrect: (optionId: string) => void;
  options: QuizQuestionOption[];
}

interface OptionInputFieldProps {
  index: number;
  isCorrect: boolean;
  canRemoveOption: boolean;
  onToggleCorrect: () => void;
  onRemoveOption: () => void;
}

const OptionInputField: FC<OptionInputFieldProps> = ({
  index,
  isCorrect,
  canRemoveOption,
  onToggleCorrect,
  onRemoveOption,
}) => {
  const [field, meta] = useField<string>(`options.${index}.text`);
  const hasError = meta.touched && Boolean(meta.error);

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-[#1E1E1E]">{`Option ${index + 1}`}</label>

      <div className="relative">
        <input
          {...field}
          type="text"
          placeholder="Enter Option"
          className={`w-full rounded-xl border pl-10 pr-11 text-sm outline-none text-black ${
            isCorrect ? "h-16 pt-2 pb-6" : "h-12"
          } ${
            hasError
              ? "border-red-500"
              : isCorrect
                ? "border-blue bg-[#D4A43714]"
                : "border-[#4D4B4B]"
          }`}
        />

        <input
          type="checkbox"
          checked={isCorrect}
          onChange={onToggleCorrect}
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-2xl border-[#BDBDBD] accent-[#013B4D]"
          aria-label={`Mark option ${index + 1} as correct answer`}
        />

        <button
          type="button"
          onClick={onRemoveOption}
          disabled={!canRemoveOption}
          className={`absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 transition ${
            canRemoveOption
              ? "text-[#E53935] hover:bg-[#FCECEC]"
              : "cursor-not-allowed text-[#DADADA]"
          }`}
          aria-label={`Remove option ${index + 1}`}
        >
          <Image
            src={TrashIcon}
            alt="Remove Option"
            width={16}
            height={16}
            className="h-5 w-5"
          />
        </button>

        {isCorrect && (
          <p className="pointer-events-none absolute bottom-1 left-10 text-xs font-medium text-[#31A24C]">
            Correct Answer
          </p>
        )}
      </div>

      {hasError && <p className="text-xs text-red-500">{meta.error}</p>}
    </div>
  );
};

const QuestionOptionsEditor: FC<QuestionOptionsEditorProps> = ({
  error,
  onAddOption,
  onRemoveOption,
  onToggleCorrect,
  options,
}) => {
  const canAddOption = options.length < MULTIPLE_CHOICE_MAX_OPTIONS;
  const canRemoveOption = options.length > MULTIPLE_CHOICE_MIN_OPTIONS;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-medium text-black">Options</h4>
        <Button
          type="button"
          variant="outline"
          className="!h-11 !rounded-xl !px-4 !py-0 text-sm"
          iconLeft={<FiPlusCircle className="h-5 w-5" />}
          onClick={onAddOption}
          disabled={!canAddOption}
        >
          Add Option
        </Button>
      </div>

      <p className="text-sm">
        After adding your options, select the correct answer to the question
      </p>

      <div className="space-y-4">
        {options.map((option, index) => (
          <div key={option.id} className="space-y-2">
            <OptionInputField
              index={index}
              isCorrect={option.isCorrect}
              canRemoveOption={canRemoveOption}
              onToggleCorrect={() => onToggleCorrect(option.id)}
              onRemoveOption={() => onRemoveOption(option.id)}
            />
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-[#E53935]">{error}</p>}
    </div>
  );
};

export default QuestionOptionsEditor;
