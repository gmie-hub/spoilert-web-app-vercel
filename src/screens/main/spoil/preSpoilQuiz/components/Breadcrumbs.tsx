"use client";

import Image from "next/image";
import Link from "next/link";

import ArrowLeftIcon from "@spt/assets/icons/arrow-left.svg";

export const Breadcrumbs = ({
  crumbLabel,
  onBack,
  spoilId,
}: {
  crumbLabel: string;
  onBack: () => void;
  spoilId: number | string;
}) => (
  <div className="flex flex-wrap items-center gap-3 text-sm text-[#5F6368]">
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-2 font-medium text-[#0C4A5C]"
    >
      <Image src={ArrowLeftIcon} alt="Back" width={18} height={18} />
      Back
    </button>

    <span className="h-5 w-px bg-[#D9D9D9]" />

    <Link href="/" className="underline underline-offset-2">
      Homepage
    </Link>
    <span>/</span>
    <Link href={`/spoil/${spoilId}`} className="underline underline-offset-2">
      Spoil Overview
    </Link>
    <span>/</span>
    <span>{crumbLabel}</span>
  </div>
);
