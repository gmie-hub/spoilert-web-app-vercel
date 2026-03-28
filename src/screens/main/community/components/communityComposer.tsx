"use client";

import { useState } from "react";

import Image from "next/image";
import { FiPaperclip, FiSmile } from "react-icons/fi";

import SendIcon from "@spt/assets/icons/send.svg";
import useCreateCommunityCommentMutation from "@spt/hooks/apiRequests/useCreateCommunityCommentMutation";
import useCreateCommunityPostMutation from "@spt/hooks/apiRequests/useCreateCommunityPostMutation";

interface CommunityComposerProps {
  placeholder: string;
  communityId?: string | number;
  isComment?: boolean;
  postId?: string | number | null;
}


const CommunityComposer = ({ placeholder, communityId, isComment = false, postId = null }: CommunityComposerProps) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const { createPostHandler, isLoading } = useCreateCommunityPostMutation();
  const { createCommentHandler, isLoading: creatingComment } = useCreateCommunityCommentMutation();
  
  // `isComment` and `postId` are passed down from the detail view when composing a comment

  const handleSend = async () => {
    if (!text.trim()) return;

    // If composing a comment, use the comment endpoint
    // Comments don't support files in this UI
    // `postId` must be provided when `isComment` is true
    if ((isComment ?? false)) {
      if (!postId) return;
      try {
        await createCommentHandler({ post_id: postId, comment: text });
        setText("");
      } catch {
        // error handled by hook
      }
      return;
    }

    // Otherwise create a regular community post
    if (files.length === 0 && !text.trim()) return;

    const form = new FormData();
    form.append("content", text);
    if (communityId) form.append("community_id", String(communityId));
    files.forEach((f) => form.append("files[]", f));

    try {
      await createPostHandler(form);
      setText("");
      setFiles([]);
    } catch {
      // error handled by hook
    }
  };

  return (
    <div className="flex gap-2 items-center mt-4">
      <div className="rounded-xl w-full border border-[#E8EDF0] p-4 shadow-[0_12px_40px_rgba(11,83,104,0.04)]">
        <div className="flex items-center gap-3">
          {!isComment ? (
            <button
              type="button"
              className="flex items-center justify-center text-[#A0A9B2] transition hover:text-[#0B5368]"
              aria-label="Add emoji"
            >
              <FiSmile className="text-2xl" />
            </button>
          ) : null}
          <input
            type="text"
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border-none bg-transparent text-sm text-[#1F2933] outline-none placeholder:text-[#A0A9B2]"
          />
          {!isComment ? (
            <label className="text-[#76828D] transition hover:text-[#0B5368] cursor-pointer" aria-label="Attach file">
              <input
                type="file"
                className="hidden"
                multiple
                onChange={(e) => {
                  const chosen = e.target.files ? Array.from(e.target.files) : [];
                  setFiles(chosen);
                }}
              />
              <FiPaperclip className="text-[20px]" />
            </label>
          ) : null}
        </div>
        {files.length > 0 ? (
          <div className="mt-2 flex gap-2">
            {files.map((f, i) => (
              <div key={i} className="rounded bg-[#F3F6F8] px-2 py-1 text-xs">{f.name}</div>
            ))}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleSend}
        disabled={isLoading || creatingComment}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5368] text-white transition hover:bg-[#094659] disabled:opacity-60"
        aria-label="Send"
      >
        <Image src={SendIcon} alt="send" width={25} height={25} />
      </button>
    </div>
  );
};

export default CommunityComposer;
