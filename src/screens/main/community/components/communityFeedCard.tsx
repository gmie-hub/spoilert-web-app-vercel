"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { BsPatchCheckFill } from "react-icons/bs";
import {
  FiMoreHorizontal,
  FiThumbsUp,
} from "react-icons/fi";

import ArrowRightIcon from "@spt/assets/icons/arrow-right-icon.svg";
import EditIcon from "@spt/assets/icons/edit.svg";
import HeartIcon from "@spt/assets/icons/heart.svg";
import MessageIcon from "@spt/assets/icons/message-text.svg";
import DeleteIcon from "@spt/assets/icons/trash.svg";
import DeleteConfirmationModal from "@spt/components/deleteConfirmationModal";

import type { CommunityFeedItem } from "../communityTypes";

interface CommunityFeedCardProps {
  item: CommunityFeedItem;
  onOpenComments?: (id: string) => void;
}

const imageStyles: Record<string, string> = {
  "Understanding Design Principles":
    "bg-[linear-gradient(135deg,#23262F_0%,#454E57_34%,#D4BEA8_34%,#E2D3C6_100%)]",
  "Creative Workstation":
    "bg-[linear-gradient(135deg,#12192A_0%,#1D2F53_42%,#0D4FD6_100%)]",
  "Medical Lab Research":
    "bg-[linear-gradient(135deg,#D7E7F4_0%,#EBF6FF_35%,#B9DDF7_60%,#FFFFFF_100%)]",
};

const CommunityFeedCard = ({
  item,
  onOpenComments,
}: CommunityFeedCardProps) => {
  const isSpoil = item.type === "spoil";
  const isInteractivePost = !isSpoil && Boolean(onOpenComments);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  const handleOpenPost = () => {
    if (!isInteractivePost) {
      return;
    }

    onOpenComments?.(item.id);
  };

  useEffect(() => {
    if (!isActionsMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(event.target as Node)
      ) {
        setIsActionsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsActionsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isActionsMenuOpen]);

  return (
    <article
      className={`rounded-[24px] bg-white p-5 shadow-[0_12px_40px_rgba(11,83,104,0.08)] sm:p-6 ${
        isInteractivePost
          ? "cursor-pointer transition hover:shadow-[0_16px_44px_rgba(11,83,104,0.12)]"
          : ""
      }`}
      onClick={handleOpenPost}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpenPost();
        }
      }}
      role={isInteractivePost ? "button" : undefined}
      tabIndex={isInteractivePost ? 0 : undefined}
    >
      {isSpoil ? (
        <div className="mt-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: item.author.accentColor }}
              >
                {item.author.avatarLabel}
              </div>

              <div>
                <h3 className="text-[18px] font-semibold text-[#0B5368]">
                  {item.author.name}
                </h3>
              </div>
            </div>

            {item.promoted ? (
              <span className="rounded-full bg-[#FCE4D4] px-6 py-1.5 text-[15px] font-medium leading-none text-[#E08A4B]">
                Promoted
              </span>
            ) : null}
          </div>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              {item.author.subtitle ? (
                <p className="mt-2 text-sm text-gray-dark">
                  {item.author.subtitle}
                </p>
              ) : item.institution ? (
                <p className="mt-2 text-sm text-gray-dark">
                  {item.institution}
                </p>
              ) : null}
              {item.title ? (
                <h4 className="mt-2 font-medium leading-[1.3] text-black">
                  {item.title}
                </h4>
              ) : null}
              {item.price ? (
                <p className="mt-2 font-semibold text-[#212529]">
                  {item.price}
                </p>
              ) : null}
            </div>

            {item.tag ? (
              <span className="rounded-full bg-[#DDF1F8] px-4 py-1.5 text-[15px] font-medium leading-none text-[#0B5368]">
                {item.tag}
              </span>
            ) : null}
          </div>

          <hr className="my-5 border-0 border-t border-[#E8EDF0]" />

          <p className="text-[17px] leading-8 text-[#6A7380]">{item.content}</p>

          {item.imageLabel ? (
            <div
              className={`mt-8 h-[240px] overflow-hidden rounded-[18px] sm:h-[332px] ${
                imageStyles[item.imageLabel] ??
                "bg-[linear-gradient(135deg,#DDEBF1_0%,#9CC2D3_100%)]"
              }`}
            >
              <div className="flex h-full items-end rounded-[18px] p-5 text-sm font-medium text-white/85">
                {item.imageLabel}
              </div>
            </div>
          ) : null}

          <div className="mt-5 flex items-center justify-between rounded-b-[18px] bg-[#DDF1F8] px-5 py-3.5">
            <div className="flex items-center gap-2 text-[#8A96A2]">
              <FiThumbsUp className="text-lg" />
              <span className="text-base text-[#5C6772]">{item.likes}</span>
            </div>
            <button
              type="button"
              className="rounded-[14px] flex gap-1 border border-[#0B5368] bg-[#EFF9FD] px-3 py-2.5 text-[15px] font-semibold text-[#0B5368] transition hover:bg-white"
            >
              View More{" "}
              <Image src={ArrowRightIcon} alt="arrow" width={20} height={20} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: item.author.accentColor }}
              >
                {item.author.avatarLabel}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`text-lg font-semibold ${
                      item.author.name === "Mary Coker"
                        ? "text-[#386BFF]"
                        : item.author.name === "Jade Olasunmbo"
                          ? "text-[#12A4E6]"
                          : item.author.name === "Ifeoma Chinaza"
                            ? "text-[#D929B3]"
                            : "text-[#0B5368]"
                    }`}
                  >
                    {item.author.name}
                  </h3>
                  {item.author.verified ? (
                    <BsPatchCheckFill className="text-[#0B5368]" />
                  ) : null}
                  {item.author.badge ? (
                    <span className="rounded-md bg-[#DDF1F8] px-2 py-1 text-xs font-medium text-[#0B5368]">
                      {item.author.badge}
                    </span>
                  ) : null}
                </div>

                {item.author.subtitle ? (
                  <p className="mt-1 text-sm text-[#66727D]">
                    {item.author.subtitle}
                  </p>
                ) : null}
                <p className="mt-1 text-sm text-[#A0A9B2]">{item.createdAt}</p>
              </div>
            </div>

            <div className="relative" ref={actionsMenuRef}>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsActionsMenuOpen((current) => !current);
                }}
                className="text-[#9AA6B2] transition hover:text-[#0B5368]"
                aria-label="More options"
                aria-expanded={isActionsMenuOpen}
                aria-haspopup="menu"
              >
                <FiMoreHorizontal className="text-lg" />
              </button>

              {isActionsMenuOpen ? (
                <div
                  className="absolute right-0 top-full z-20 mt-3 min-w-[210px] overflow-hidden rounded-2xl border border-[#EEF1F4] bg-white shadow-[0_18px_48px_rgba(16,24,40,0.14)]"
                  onClick={(event) => event.stopPropagation()}
                  role="menu"
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-6 py-4 text-left text-sm text-gray transition hover:bg-[#F9FBFC]"
                    role="menuitem"
                  >
                    <Image src={EditIcon} alt="edit" width={20} height={20} />
                    <span>Edit Post</span>
                  </button>

                  <div className="border-t border-[#EEF1F4]" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsActionsMenuOpen(false);
                      setIsDeleteModalOpen(true);
                    }}
                    className="flex w-full items-center gap-3 px-6 py-4 text-left text-sm text-red transition hover:bg-[#FFF8F8]"
                    role="menuitem"
                  >
                    <Image
                      src={DeleteIcon}
                      alt="delete"
                      width={20}
                      height={20}
                    />
                    <span>Delete Post</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <p className="mt-4 leading-6 text-[#5D6670]">{item.content}</p>

          {item.imageLabel ? (
            <div
              className={`mt-5 h-[220px] rounded-[18px] sm:h-[300px] ${
                imageStyles[item.imageLabel] ??
                "bg-[linear-gradient(135deg,#DDEBF1_0%,#9CC2D3_100%)]"
              }`}
            >
              <div className="flex h-full items-end rounded-[18px] p-5 text-sm font-medium text-white/85">
                {item.imageLabel}
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-5 text-[#5C6772]">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpenComments?.(item.id);
              }}
              className="flex items-center gap-1.5 text-base transition hover:text-[#0B5368]"
            >
              <Image src={HeartIcon} alt="like" width={20} height={20} />
              <span>{item.likes}</span>
            </button>
            {item.comments > 0 ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenComments?.(item.id);
                }}
                className="flex items-center gap-1.5 text-base transition hover:text-[#0B5368]"
              >
                <Image src={MessageIcon} alt="message" width={24} height={24} />
                <span>{item.comments}</span>
              </button>
            ) : null}
          </div>
        </>
      )}

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        title="Are You Sure You Want To Delete This Post?"
        description="This action cannot be undone."
        onConfirm={() => setIsDeleteModalOpen(false)}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </article>
  );
};

export default CommunityFeedCard;
