"use client";

import Image from "next/image";

import QuizGif from "@spt/assets/images/quiz.gif";
import Button from "@spt/components/button";

import { StatRow } from "./StatRow";

import type { QuizStatItem } from "../types";

interface IntroViewProps {
  description: string;
  pageTitle: string;
  primaryButtonLabel: string;
  quizStats: QuizStatItem[];
  onStart: () => void;
}

export const IntroView = ({
  description,
  pageTitle,
  primaryButtonLabel,
  quizStats,
  onStart,
}: IntroViewProps) => (
  <div className="mx-auto mt-10 max-w-[650px]">
    <h1 className="text-lg font-semibold text-black sm:text-xl">{pageTitle}</h1>

    <div className="mt-6 rounded-[20px] border border-[#E8E8E8] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="flex justify-center">
        <Image
          src={QuizGif}
          alt="Quiz"
          width={180}
          height={140}
          unoptimized
          priority
        />
      </div>

      <p className="mt-8 max-w-[560px] leading-8 text-gray">{description}</p>

      <div className="mt-8 space-y-4">
        {quizStats.map((item) => (
          <StatRow
            key={item.label}
            alt={item.alt}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </div>

      <Button variant="darkBlue" className="mt-10 w-full py-3" onClick={onStart}>
        {primaryButtonLabel}
      </Button>
    </div>
  </div>
);
