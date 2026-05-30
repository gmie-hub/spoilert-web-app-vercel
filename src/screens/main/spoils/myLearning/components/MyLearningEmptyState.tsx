"use client";

import Image from "next/image";

import EmptyLearningImage from "@spt/assets/icons/Empty Image.svg";
import Button from "@spt/components/button";

import type { MyLearningTabKey } from "../types";

interface MyLearningEmptyStateProps {
  tab: MyLearningTabKey;
  onExplore: () => void;
}

const emptyCopy: Record<
  MyLearningTabKey,
  { title: string; description: string }
> = {
  ongoing: {
    title: "You Have No Ongoing Spoylz Yet!",
    description:
      "Track your learning progress here. Start learning to see your progress.",
  },
  completed: {
    title: "You Have Not Completed Any Spoylz Yet!",
    description:
      "Once you complete a Spoylz, it shows up here and you can download your certificate.",
  },
};

export const MyLearningEmptyState = ({
  tab,
  onExplore,
}: MyLearningEmptyStateProps) => {
  const content = emptyCopy[tab];

  return (
    <div className="flex flex-col items-center px-4 py-10 text-center sm:px-8 sm:py-14">
      <Image
        src={EmptyLearningImage}
        alt=""
        width={133}
        height={158}
        className="h-auto w-[110px] sm:w-[133px]"
      />

      <h2 className="mt-8 text-xl font-semibold text-[#212529]">
        {content.title}
      </h2>

      <p className="mt-4 max-w-[430px] leading-7 text-[#656565]">
        {content.description}
      </p>

      <Button
        variant="darkBlue"
        className="mt-8 w-full max-w-[420px] rounded-[12px] py-4"
        onClick={onExplore}
      >
        Explore Spoylz
      </Button>
    </div>
  );
};

export default MyLearningEmptyState;

