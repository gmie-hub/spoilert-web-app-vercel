"use client";

import Modal from "@spt/components/modal";

import { type CommunityFilterValue, communityFilters } from "../communityData";

interface CommunityFilterModalProps {
  open: boolean;
  selectedFilter: CommunityFilterValue;
  onClose: () => void;
  onSelect: (value: CommunityFilterValue) => void;
  onApply: () => void;
  onReset: () => void;
}

const CommunityFilterModal = ({
  open,
  selectedFilter,
  onClose,
  onSelect,
  onApply,
  onReset,
}: CommunityFilterModalProps) => (
  <Modal open={open} onClose={onClose} size="md" title="Filter">
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

    <div className="mt-8 space-y-4">
      <button
        type="button"
        onClick={onApply}
        className="w-full rounded-xl bg-[#0B5368] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#094659]"
      >
        Apply Filter
      </button>
      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-xl border border-[#E6EBEF] px-5 py-4 text-sm font-semibold text-[#0B5368] transition hover:bg-[#F7FBFC]"
      >
        Reset
      </button>
    </div>
  </Modal>
);

export default CommunityFilterModal;
