"use client";

import Image from "next/image";
import { FiPaperclip, FiSmile } from "react-icons/fi";

import SendIcon from "@spt/assets/icons/send.svg";

interface CommunityComposerProps {
  placeholder: string;
}

const CommunityComposer = ({ placeholder }: CommunityComposerProps) => (
  <div className="flex gap-2 items-center mt-4">
    <div className="rounded-xl w-full border border-[#E8EDF0] p-4 shadow-[0_12px_40px_rgba(11,83,104,0.04)]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center justify-center text-[#A0A9B2] transition hover:text-[#0B5368]"
          aria-label="Add emoji"
        >
          <FiSmile className="text-2xl" />
        </button>
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 border-none bg-transparent text-sm text-[#1F2933] outline-none placeholder:text-[#A0A9B2]"
        />
        <button
          type="button"
          className="text-[#76828D] transition hover:text-[#0B5368]"
          aria-label="Attach file"
        >
          <FiPaperclip className="text-[20px]" />
        </button>
      </div>
    </div>

    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5368] text-white transition hover:bg-[#094659]"
      aria-label="Send"
    >
      <Image src={SendIcon} alt="send" width={25} height={25} />
    </button>
  </div>
);

export default CommunityComposer;
