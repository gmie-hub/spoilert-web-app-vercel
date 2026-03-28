"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsPatchCheckFill } from "react-icons/bs";
import {
  FiMoreHorizontal,
  FiThumbsUp,
} from "react-icons/fi";


import ArrowRightIcon from "@spt/assets/icons/arrow-right-icon.svg";
import EditIcon from "@spt/assets/icons/edit.svg";
import MessageIcon from "@spt/assets/icons/message-text.svg";
import DeleteIcon from "@spt/assets/icons/trash.svg";
import DeleteConfirmationModal from "@spt/components/deleteConfirmationModal";
import useDeleteCommunityCommentMutation from "@spt/hooks/apiRequests/useDeleteCommunityCommentMutation";
import useDeleteCommunityPostMutation from "@spt/hooks/apiRequests/useDeleteCommunityPostMutation";
import api from "@spt/utils/apiClient";

import type { CommunityFeedItem } from "../communityTypes";

interface CommunityFeedCardProps {
  item: CommunityFeedItem;
  onOpenComments?: (id: string) => void;
  isComment?: boolean;
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
  isComment = false,
}: CommunityFeedCardProps) => {
  const isSpoil = item.type === "spoil";
  const isInteractivePost = !isSpoil && Boolean(onOpenComments);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const { deletePostHandler, isLoading: deletingPost } = useDeleteCommunityPostMutation();
  const { deleteCommentHandler, isLoading: deletingComment } = useDeleteCommunityCommentMutation();

  // normalize API post shape and provide fallbacks for older item shapes
  const apiPost = (item as any) ?? {};
  const postId = apiPost.id ?? apiPost.post_id ?? "";
  const content = apiPost.content ??apiPost.comment ?? apiPost.description ?? apiPost.body ?? "";
  const files = Array.isArray(apiPost.files) ? apiPost.files : apiPost.image ? [apiPost.image] : [];
  const likesCount = apiPost.total_likes ?? apiPost.likes ?? 0;
  const commentsCount = apiPost.total_comments ?? apiPost.comments ?? 0;
  const createdAt = apiPost.created_at ?? apiPost.createdAt ?? apiPost.updated_at ?? "";
  const user = apiPost.user ?? apiPost.author ?? {};
  const nameFromParts = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  const userName = user?.username ?? (nameFromParts || user?.name || "");
  const avatarLabel = user?.username ? String(user.username).slice(0, 1).toUpperCase() : (user?.first_name ? String(user.first_name).slice(0, 1).toUpperCase() : (user?.name ? String(user.name).slice(0, 1).toUpperCase() : ""));
  const accentColor = user?.accentColor ?? "#C8D4E3";

  const handleOpenPost = () => {
    if (!isInteractivePost) {
      return;
    }

    onOpenComments?.(String(postId));
  };

  const [hasLikedState, setHasLikedState] = useState<boolean>(Boolean(apiPost.has_liked));
  const [likesState, setLikesState] = useState<number>(likesCount);

  const handleToggleLike = async (event?: React.SyntheticEvent) => {
    event?.stopPropagation();
    if (!postId) return;

    // optimistic update
    const nextLiked = !hasLikedState;
    setHasLikedState(nextLiked);
    setLikesState((s) => (nextLiked ? s + 1 : Math.max(0, s - 1)));

    try {
      await api.post(`/communities/posts/likes/${postId}`);
    } catch (err) {
      // revert on error
      setHasLikedState((prev) => !prev);
      setLikesState((s) => (hasLikedState ? Math.max(0, s - 1) : s + 1));
      toast.error("Failed to update like. Please try again.");
    }
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
                style={{ backgroundColor: accentColor }}
              >
                {avatarLabel}
              </div>

              <div>
                <h3 className="text-[18px] font-semibold text-[#0B5368]">
                  {userName}
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
              {user?.subtitle ? (
                <p className="mt-2 text-sm text-gray-dark">
                  {user.subtitle}
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
              {apiPost.price ? (
                <p className="mt-2 font-semibold text-[#212529]">
                  {apiPost.price}
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

          <p className="text-[17px] leading-8 text-[#6A7380]">{content}</p>

          {files.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-3">
              {files.slice(0, 4).map((f: any, idx: number) => (
                <div key={idx} className="overflow-hidden rounded-lg">
                  <img src={String(f)} alt={`post-file-${idx}`} className="w-full object-cover" />
                </div>
              ))}
            </div>
          ) : null}

            <div className="mt-5 flex items-center justify-between rounded-b-[18px] bg-[#DDF1F8] px-5 py-3.5">
            <div className="flex items-center gap-2 text-[#8A96A2]">
              <FiThumbsUp className="text-lg" />
              <span className="text-base text-[#5C6772]">{likesCount}</span>
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
                style={{ backgroundColor: accentColor }}
              >
                {avatarLabel}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`text-lg font-semibold ${
                      userName === "Mary Coker"
                        ? "text-[#386BFF]"
                        : userName === "Jade Olasunmbo"
                          ? "text-[#12A4E6]"
                          : userName === "Ifeoma Chinaza"
                            ? "text-[#D929B3]"
                            : "text-[#0B5368]"
                    }`}
                  >
                    {userName}
                  </h3>
                  {user?.verified ? (
                    <BsPatchCheckFill className="text-[#0B5368]" />
                  ) : null}
                  {user?.badge ? (
                    <span className="rounded-md bg-[#DDF1F8] px-2 py-1 text-xs font-medium text-[#0B5368]">
                      {user.badge}
                    </span>
                  ) : null}
                </div>

                {user?.subtitle ? (
                  <p className="mt-1 text-sm text-[#66727D]">
                    {user.subtitle}
                  </p>
                ) : null}
                <p className="mt-1 text-sm text-[#A0A9B2]">{createdAt}</p>
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
                    <span>{isComment ? "Edit Comment" : "Edit Post"}</span>
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
                    <span>{isComment ? "Delete Comment" : "Delete Post"}</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <p className="mt-4 leading-6 text-[#5D6670]">{content}</p>

          {files.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-3">
              {files.slice(0, 4).map((f: any, idx: number) => (
                <div key={idx} className="overflow-hidden rounded-lg">
                  <img src={String(f)} alt={`post-file-${idx}`} className="w-full object-cover" />
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-5 text-[#5C6772]">
            <button
              type="button"
              onClick={handleToggleLike}
              className="flex items-center gap-1.5 text-base transition hover:text-[#0B5368]"
            >
              {hasLikedState ? (
                <AiFillHeart className="text-[20px]" style={{ color: "#E0245E" }} />
              ) : (
                <AiOutlineHeart className="text-[20px]" style={{ color: "#0B5368" }} />
              )}
              <span>{likesState}</span>
            </button>
            {commentsCount > 0 ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenComments?.(String(postId));
                }}
                className="flex items-center gap-1.5 text-base transition hover:text-[#0B5368]"
              >
                <Image src={MessageIcon} alt="message" width={24} height={24} />
                <span>{commentsCount}</span>
              </button>
            ) : null}
          </div>
        </>
      )}

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        title={isComment ? "Are You Sure You Want To Delete This Comment?" : "Are You Sure You Want To Delete This Post?"}
        description="This action cannot be undone."
        isLoading={isComment ? deletingComment : deletingPost}
        onConfirm={async () => {
          try {
            if (isComment) {
              await deleteCommentHandler(postId);
            } else {
              await deletePostHandler(postId);
            }
          } catch {
            // errors are shown by hook
          } finally {
            setIsDeleteModalOpen(false);
          }
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </article>
  );
};

export default CommunityFeedCard;
