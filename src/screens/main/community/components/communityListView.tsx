"use client";


import Image from "next/image";

import InfoIcon from "@spt/assets/icons/info.svg";

import { tutorTabs } from "../communityPageTypes";


import CommunityCard from "./communityCard";
import CommunitySearchBar from "./communitySearchBar";
import CommunityTabs from "./communityTabs";

import type { PrimaryTab, TutorTab } from "../communityPageTypes";
import type { CommunityCardItem } from "../communityTypes";



interface CommunityListViewProps {
  activePrimaryTab: PrimaryTab;
  activeTutorTab: TutorTab;
  filteredExploreCommunities: CommunityCardItem[];
  filteredMyCommunities: CommunityCardItem[];
  isTutor: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onTutorTabChange: (value: TutorTab) => void;
  onOpenFilter: () => void;
  onOpenCommunity: () => void;
}

const CommunityListView = ({
  activePrimaryTab,
  activeTutorTab,
  filteredExploreCommunities,
  filteredMyCommunities,
  isTutor,
  searchValue,
  onSearchChange,
  onTutorTabChange,
  onOpenFilter,
  onOpenCommunity,
}: CommunityListViewProps) => {
  if (activePrimaryTab === "explore") {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-2 rounded-xl border border-[#B8E3F8] bg-[#EAF7FF] px-4 py-2 text-sm text-black">
          <Image src={InfoIcon} alt="filter" width={20} height={20} />
          <p>
            Locked communities are exclusive to learners enrolled in their
            associated spoils. Enroll to gain access.
          </p>
        </div>

        <div className="max-w-[520px]">
          <CommunitySearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search for a community.."
            onFilterClick={onOpenFilter}
          />
        </div>

        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
          {filteredExploreCommunities.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              variant="explore"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isTutor ? (
        <CommunityTabs
          tabs={tutorTabs}
          value={activeTutorTab}
          onChange={onTutorTabChange}
          variant="pill"
        />
      ) : null}

      <div className="max-w-[520px]">
        <CommunitySearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search for a community.."
          onFilterClick={() => undefined}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {filteredMyCommunities.map((community) => (
          <CommunityCard
            key={community.id}
            community={community}
            variant="member"
            onClick={onOpenCommunity}
          />
        ))}
      </div>
    </div>
  );
};

export default CommunityListView;
