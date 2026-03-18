"use client";

import { useState } from "react";

import Image from "next/image";

import ExitIcon from "@spt/assets/icons/exit.svg";
import Button from "@spt/components/button";
import DeleteConfirmationModal from "@spt/components/deleteConfirmationModal";

import type { CommunityProfile } from "../communityTypes";

interface CommunityDetailSidebarProps {
  community: CommunityProfile;
}

const CommunityDetailSidebar = ({ community }: CommunityDetailSidebarProps) => {
  const [isLeaveCommunityModalOpen, setIsLeaveCommunityModalOpen] =
    useState(false);

  return (
    <>
      <aside className="h-fit self-start rounded-[24px] bg-white p-6 shadow-[0_12px_40px_rgba(11,83,104,0.08)]">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-base font-semibold text-white"
          style={{ backgroundColor: community.accentColor }}
        >
          {community.avatarLabel}
        </div>

        <p className="mt-5 text-center font-medium text-gray">
          {community.members} Members
        </p>

        <div className="mt-6 rounded-[18px] border border-[#E8EDF0] p-5">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray">Created By</p>
              <p className="mt-1 font-medium text-black">
                {community.createdBy}
              </p>
              <button
                type="button"
                className="mt-3 rounded-xl border border-[#DCE3E8] px-4 py-2 text-sm font-semibold text-[#0B5368] transition hover:bg-[#F6FBFC]"
              >
                View Profile
              </button>
            </div>

            <div className="border-t border-[#EEF1F4] pt-4">
              <p className="text-sm text-gray">Spoil Title</p>
              <p className="mt-1 font-medium text-black">
                {community.spoilTitle}
              </p>
            </div>

            <div className="border-t border-[#EEF1F4] pt-4">
              <p className="text-sm text-gray">Date Created</p>
              <p className="mt-1 font-medium text-black">
                {community.createdDate}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[18px] border border-[#E8EDF0] p-5">
          <p className="text-sm text-gray">Description</p>
          <p className="mt-2 leading-8 text-black">{community.description}</p>
        </div>

        <Button
          type="button"
          onClick={() => setIsLeaveCommunityModalOpen(true)}
          className="mt-5 bg-transparent px-0 text-sm text-red! transition hover:bg-transparent hover:opacity-80"
          iconLeft={<Image src={ExitIcon} alt="exit" width={20} height={20} />}
        >
          Leave Community
        </Button>
      </aside>

      <DeleteConfirmationModal
        open={isLeaveCommunityModalOpen}
        title="Are You Sure You Want To Leave This Community?"
        description="Once you leave, you won’t be able to view posts, comments, or add new posts in this community."
        confirmLabel="Yes Leave Community"
        onConfirm={() => setIsLeaveCommunityModalOpen(false)}
        onCancel={() => setIsLeaveCommunityModalOpen(false)}
        icon={ExitIcon}
      />
    </>
  );
};

export default CommunityDetailSidebar;
