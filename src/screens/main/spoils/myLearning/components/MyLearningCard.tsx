"use client";

import React from "react";

import Image from "next/image";
import { FiArrowRight, FiDownload } from "react-icons/fi";

import CompletedIcon from "@spt/assets/icons/completed.svg";

import MyLearningProgressBar from "./MyLearningProgressBar";

import type { LearningItem, MyLearningTabKey } from "../types";

interface MyLearningCardProps {
  item: LearningItem;
  tab: MyLearningTabKey;
  onAction: (item: LearningItem) => void;
  onCertificate?: (item: LearningItem) => void;
}

export const MyLearningCard = ({
  item,
  tab,
  onAction,
  onCertificate,
}: MyLearningCardProps) => {
  const isCompleted = tab === "completed";
  const showCertificate = isCompleted && item.hasCertificate;

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (!isCompleted) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onAction(item);
    }
  };

  return (
    <article
      {...(isCompleted
        ? {
            role: "button",
            tabIndex: 0,
            onClick: () => onAction(item),
            onKeyDown: handleCardKeyDown,
            className:
              "rounded-[16px] border border-[#F0F2F4] bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-4 cursor-pointer",
          }
        : {
            className:
              "rounded-[16px] border border-[#F0F2F4] bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-4",
          })}
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-[88px] w-full overflow-hidden rounded-[14px] bg-[#EAECEF] sm:w-[112px] sm:shrink-0">
          <Image
            src={item.coverImage}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, 112px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[16px] font-medium text-[#212529]">
            {item.title}
          </h3>

          <span className="mt-2 inline-flex rounded-full bg-[#E7F5FA] px-3 py-1 text-[11px] font-medium text-[#0B5368]">
            {item.category}
          </span>

          <div className="mt-4 flex items-center gap-2">
            <MyLearningProgressBar progress={item.progress} />
            <span className="text-xs font-medium text-[#212529]">
              {item.progress}%
            </span>
            {isCompleted ? (
              <Image src={CompletedIcon} alt="Completed" width={14} height={14} />
            ) : null}
          </div>

          {isCompleted && !showCertificate ? null : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (showCertificate) {
                  if (onCertificate) onCertificate(item);
                  return;
                }

                onAction(item);
              }}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#0B5368] underline underline-offset-4 cursor-pointer"
            >
              {showCertificate ? "View & Download Certificate" : "Continue Learning"}
              {showCertificate ? <FiDownload size={14} /> : <FiArrowRight size={14} />}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default MyLearningCard;

