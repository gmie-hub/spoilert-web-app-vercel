"use client";

import Image from "next/image";
import { FiX } from "react-icons/fi";

import FilterIcon from "@spt/assets/icons/filter.svg";
import SearchIcon from "@spt/assets/icons/search-normal.svg";


interface CommunitySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onFilterClick?: () => void;
  onSubmit?: () => void;
  showActionButton?: boolean;
}

const CommunitySearchBar = ({
  value,
  onChange,
  placeholder,
  onFilterClick,
  onSubmit,
  showActionButton = false,
}: CommunitySearchBarProps) => (
  <div className="flex w-full flex-col gap-3 rounded-[18px] border border-gray-lightest sm:flex-row px-4 py-3 sm:items-center">
    <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#E8EDF0] bg-[#FBFBFB] px-4 py-3">
      <Image src={SearchIcon} alt="search" width={20} height={20} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-[#1F2933] outline-none placeholder:text-gray-light"
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

      {!showActionButton ? (
        <button
          type="button"
          onClick={onFilterClick}
          className="rounded-xl p-1 text-[#9AA6B2] transition hover:text-[#0B5368]"
          aria-label="Open filters"
        >
          <Image src={FilterIcon} alt="filter" width={20} height={20}className="text-[18px]" />
        </button>
      ) : null}
    </div>

    {showActionButton ? (
      <button
        type="button"
        onClick={onSubmit}
        className="min-w-[126px] rounded-xl bg-[#0B5368] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#094659]"
      >
        Search
      </button>
    ) : null}
  </div>
);

export default CommunitySearchBar;
