"use client";

import type { ReactNode } from "react";

import Image from "next/image";

import ClockIcon from "@spt/assets/icons/blue-clock.svg";
import NoteIcon from "@spt/assets/icons/note.svg";

import type { QuizStatIcon } from "../types";

const buildNoteIcon = (alt: string) => (
  <Image src={NoteIcon} alt={alt} width={24} height={24} />
);

const buildClockIcon = (alt: string) => (
  <Image src={ClockIcon} alt={alt} width={24} height={24} />
);

const renderStatIcon = (icon: QuizStatIcon, alt: string): ReactNode =>
  icon === "clock" ? buildClockIcon(alt) : buildNoteIcon(alt);

export const StatRow = ({
  alt,
  icon,
  label,
}: {
  alt: string;
  icon: QuizStatIcon;
  label: string;
}) => (
  <div className="flex items-center gap-3 text-[15px] text-[#5F6368]">
    {renderStatIcon(icon, alt)}
    <span>{label}</span>
  </div>
);
