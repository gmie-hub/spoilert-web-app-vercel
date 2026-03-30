"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import toast from "react-hot-toast";

import ExitIcon from "@spt/assets/icons/exit.svg";
import Button from "@spt/components/button";
import DeleteConfirmationModal from "@spt/components/deleteConfirmationModal";
import Modal from "@spt/components/modal";
import useLeaveCommunityMutation from "@spt/hooks/apiRequests/useLeaveCommunityMutation";
import useUpdateCommunityMutation from "@spt/hooks/apiRequests/useUpdateCommunityMutation";

import MembersList from "./MembersList";

import type { CommunityProfile } from "../communityTypes";

interface CommunityDetailSidebarProps {
  community?: CommunityProfile | null;
  isCreatorView?: boolean;
}

const CommunityDetailSidebar = ({ community, isCreatorView }: CommunityDetailSidebarProps) => {
  const safeCommunity: CommunityProfile = (community as any) || {
    id: "",
    name: "",
    members: 0,
    description: "",
    spoilTitle: "",
    createdBy: "",
    createdDate: "",
    avatarLabel: "",
    accentColor: "#C8D4E3",
    feed: [],
    comments: [],
    only_owner:0,
  };

  const [isLeaveCommunityModalOpen, setIsLeaveCommunityModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  const { mutateAsync: leaveCommunityAsync, isPending: isLeaving, isError, errorMessage } = useLeaveCommunityMutation();

  useEffect(() => {
    if (isError && isLeaveCommunityModalOpen) {
      toast.error(errorMessage || "Failed to leave community");
    }
  }, [isError, errorMessage, isLeaveCommunityModalOpen]);

  console.log(safeCommunity, "only_owner value in sidebar");
  const ToggleLock = () => {
    const { updateCommunityHandler, isLoading: isUpdating } = useUpdateCommunityMutation();
    const initialLocked =
      (safeCommunity as any)?.only_owner === 1 ||
      (safeCommunity as any)?.community?.only_owner === 1 ||
      false;
    const [locked, setLocked] = useState<boolean>(initialLocked);

    const handleToggle = async () => {
      const next = !locked;
      setLocked(next);
      try {
        const communityId = (safeCommunity as any)?.id ?? (safeCommunity as any)?.community?.id;
        await updateCommunityHandler(communityId, { only_owner: next ? 1 : 0 });
      } catch (err: any) {
        // revert on error
        setLocked((p) => !p);
        toast.error(err?.response?.data?.message || err?.message || "Failed to update community lock");
      }
    };
    return (
      <button
        type="button"
        aria-pressed={locked}
        onClick={handleToggle}
        disabled={isUpdating}
        className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors ${locked ? "bg-[#0B5368]" : "bg-[#E6EEF0]"}`}
      >
        <span className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${locked ? "translate-x-6" : "translate-x-0"}`} />
      </button>
    );
  };

  return (
    <>
      <aside className="h-fit self-start rounded-[24px] bg-white p-6 shadow-[0_12px_40px_rgba(11,83,104,0.08)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-base font-semibold text-white" style={{ backgroundColor: safeCommunity.accentColor }}>
          {safeCommunity?.avatarLabel}
        </div>

        <p className="mt-5 text-center font-medium text-gray">{safeCommunity?.members} Members</p>

        {isCreatorView ? (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsMembersModalOpen(true)}
              className="w-full rounded-lg border border-[#DCE3E8] px-4 py-3 text-sm font-semibold text-[#0B5368] flex items-center justify-center gap-2"
            >
              <span className="inline-block">👁️</span>
              View Members
            </button>
          </div>
        ) : null}

        <div className="mt-6 rounded-[18px] border border-[#E8EDF0] p-5">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray">Created By</p>
              <p className="mt-1 font-medium text-black">
                {safeCommunity?.spoil?.tutor?.first_name} {safeCommunity?.spoil?.tutor?.last_name}
                {isCreatorView ? " (You)" : ""}
              </p>
              {!isCreatorView ? (
                <button type="button" className="mt-3 rounded-xl border border-[#DCE3E8] px-4 py-2 text-sm font-semibold text-[#0B5368] transition hover:bg-[#F6FBFC]">
                  View Profile
                </button>
              ) : null}
            </div>

            <div className="border-t border-[#EEF1F4] pt-4">
              <p className="text-sm text-gray">Spoil Title</p>
              <p className="mt-1 font-medium text-black">{safeCommunity.spoilTitle}</p>
            </div>

            <div className="border-t border-[#EEF1F4] pt-4">
              <p className="text-sm text-gray">Date Created</p>
              <p className="mt-1 font-medium text-black">{safeCommunity.createdDate}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[18px] border border-[#E8EDF0] p-5">
          <p className="text-sm text-gray">Description</p>
          <p className="mt-2 leading-8 text-black">{safeCommunity.description}</p>
        </div>

        {isCreatorView ? (
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-[12px] border border-[#E8EDF0] p-4">
              <div>
                <p className="text-sm font-medium">Lock Posts and Comments</p>
                <p className="text-xs text-gray">Once toggled on, only you will be able to post in this community. Other members won’t be able to post or comment until you toggle it off</p>
              </div>
              <ToggleLock />
            </div>
          </div>
        ) : (
          <Button
            type="button"
            onClick={() => setIsLeaveCommunityModalOpen(true)}
            className="mt-5 bg-transparent px-0 text-sm text-red! transition hover:bg-transparent hover:opacity-80"
            iconLeft={<Image src={ExitIcon} alt="exit" width={20} height={20} />}
          >
            Leave Community
          </Button>
        )}
      </aside>

      <DeleteConfirmationModal
        open={isLeaveCommunityModalOpen}
        title="Are You Sure You Want To Leave This Community?"
        description="Once you leave, you won’t be able to view posts, comments, or add new posts in this community."
        confirmLabel="Yes Leave Community"
        isLoading={isLeaving}
        loadingLabel="Leaving..."
        onConfirm={async () => {
          try {
            const res = await leaveCommunityAsync({ community_id: Number(safeCommunity.id) });
            toast.success(res?.message || "You have left the community");
            setIsLeaveCommunityModalOpen(false);
          } catch (err: any) {
            toast.error(errorMessage || err?.response?.data?.message || err?.message || "Failed to leave community");
          }
        }}
        onCancel={() => setIsLeaveCommunityModalOpen(false)}
        icon={ExitIcon}
      />

      <Modal open={isMembersModalOpen} title="Members" onClose={() => setIsMembersModalOpen(false)} size="md">
        <MembersList communityId={safeCommunity.id} tutorId={safeCommunity?.spoil?.tutor?.id} onClose={() => setIsMembersModalOpen(false)} />
      </Modal>
    </>
  );
};

export default CommunityDetailSidebar;
