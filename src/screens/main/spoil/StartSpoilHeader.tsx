"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

import ArrowRightIcon from "@spt/assets/icons/arrow-right.svg";
import ChatIcon from "@spt/assets/icons/chat.svg";
import Button from "@spt/components/button";
import useJoinCommunityMutation from "@spt/hooks/apiRequests/useJoinCommunityMutation";
import type { SpoilDetailsData } from "@spt/utils/spoils";

import { Breadcrumbs } from "./preSpoilQuiz/components/Breadcrumbs";

interface StartSpoilHeaderProps {
  /** A spoil may have no community at all. */
  community: SpoilDetailsData["community"];
  spoilId: number;
}

/** Breadcrumbs and the two CTAs sitting above the lesson view. */
export const StartSpoilHeader = ({
  community,
  spoilId,
}: StartSpoilHeaderProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { joinCommunityHandler, isLoading: isJoiningCommunity } =
    useJoinCommunityMutation();

  // When there is a community, `has_joined` says whether the current user is
  // already a member.
  const hasJoinedCommunity = community?.has_joined ?? false;

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(`/spoil/${spoilId}`);
  };

  const handleCommunityAction = async () => {
    if (!community) return;

    // Already a member -> take them to the community area.
    if (hasJoinedCommunity) {
      router.push("/community");
      return;
    }

    // Not a member yet -> join, then refresh spoil details so the button
    // flips to "View Community".
    if (isJoiningCommunity) return;

    const response = await joinCommunityHandler(community.id);
    if (response) {
      await queryClient.invalidateQueries({ queryKey: ["spoil-details"] });
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <Breadcrumbs crumbLabel="Start Spoil" onBack={handleBack} spoilId={spoilId} />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          className="gap-2 rounded-[14px] border-[#A9C2CB] px-5 py-3 text-[#013B4D]"
          iconLeft={<Image src={ChatIcon} alt="" width={20} height={20} />}
          onClick={() => router.push(`/spoil/${spoilId}/chat-tutor`)}
        >
          Chat Tutor
        </Button>

        {community && (
          <Button
            variant="darkBlue"
            className="gap-2 rounded-[14px] px-5 py-3"
            iconRight={<Image src={ArrowRightIcon} alt="" width={16} height={16} />}
            onClick={handleCommunityAction}
            disabled={isJoiningCommunity}
          >
            {hasJoinedCommunity
              ? "View Community"
              : isJoiningCommunity
                ? "Joining..."
                : "Join Community"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StartSpoilHeader;
