"use client";

import Image from "next/image";
import { FiX } from "react-icons/fi";

import SearchIcon from "@spt/assets/icons/search-normal.svg";

interface MySpoilsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const MySpoilsSearchBar = ({
  value,
  onChange,
}: MySpoilsSearchBarProps) => {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-[14px] border border-[#E9EEF2] bg-white px-4 py-3">
      <Image src={SearchIcon} alt="search" width={18} height={18} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search for a Spoylz.."
        className="w-full border-none bg-transparent text-sm text-[#20262D] outline-none placeholder:text-[#A0A9B2]"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-[#9AA6B2] transition hover:text-[#0B5368]"
          aria-label="Clear search"
        >
          <FiX className="text-[16px]" />
        </button>
      ) : null}
    </div>
  );
};

export default MySpoilsSearchBar;
