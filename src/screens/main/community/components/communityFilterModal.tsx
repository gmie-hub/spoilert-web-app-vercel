"use client";

import { useMemo, useState } from "react";

import Modal from "@spt/components/modal";

import { type CommunityFilterValue, communityFilters } from "../communityData";

import type { CommunityCardItem } from "../communityTypes";

interface CommunityFilterModalProps {
  open: boolean;
  selectedFilter: CommunityFilterValue;
  onClose: () => void;
  onSelect: (value: CommunityFilterValue) => void;
  onApply: () => void;
  onReset: () => void;
  // optional: provide communities to preview inside modal
  communities?: CommunityCardItem[];
  // optional: notify parent of a search term applied in modal
  onSearch?: (term: string) => void;
}

const CommunityFilterModal = ({
  open,
  selectedFilter,
  onClose,
  onSelect,
  onApply,
  onReset,
  communities = [],
  onSearch,
}: CommunityFilterModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCommunities = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return communities.filter((c) => {
      const matchesTerm =
        term.length === 0 ||
        c.name.toLowerCase().includes(term) ||
        (c.description ?? "").toLowerCase().includes(term);

      const matchesAudience =
        selectedFilter === "all" ? true : c.audience === selectedFilter;

      return matchesTerm && matchesAudience;
    });
  }, [communities, searchTerm, selectedFilter]);

  const handleApply = () => {
    onSearch?.(searchTerm);
    onApply();
  };

  const handleReset = () => {
    setSearchTerm("");
    onSearch?.("");
    onReset();
  };

  return (
    <Modal open={open} onClose={onClose} size="md" title="Filter">
      <div className="space-y-4">
        <input
          aria-label="Search communities"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search communities..."
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        <div className="space-y-2">
          {communityFilters.map((filter) => {
            const isActive = selectedFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onSelect(filter.value)}
                className="flex w-full items-center justify-between border-b border-[#EEF1F4] py-4 text-left text-base text-[#4B5563]"
              >
                <span>{filter.label}</span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                    isActive ? "border-[#0B5368]" : "border-[#A9B0B7]"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isActive ? "bg-[#0B5368]" : "bg-transparent"
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>

       

        <div className="mt-2 space-y-2">
          <button
            type="button"
            onClick={handleApply}
            className="w-full rounded-xl bg-[#0B5368] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#094659]"
          >
            Apply Filter
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-xl border border-[#E6EBEF] px-5 py-3 text-sm font-semibold text-[#0B5368] transition hover:bg-[#F7FBFC]"
          >
            Reset
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CommunityFilterModal;
