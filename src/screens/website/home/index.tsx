import Discover from "./discover";
import GlobalCommunity from "./globalCommunity";
import LearningPlatform from "./learningPlatform";
import WhatSpoilertOffers from "./whatSpoilertOffers";
import WhyWeAreDifferent from "./whyWeAreDifferent";

const WebsiteHome = () => {
  return (
    <main>
      <Discover />
      <LearningPlatform />
      <WhyWeAreDifferent />
      <WhatSpoilertOffers />
      <GlobalCommunity />
    </main>
  );
};

export default WebsiteHome;