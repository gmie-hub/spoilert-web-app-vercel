import Discover from "./discover";
import GlobalCommunity from "./globalCommunity";
import InstitutionSpoils from "./institutionSpoils";
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
      <InstitutionSpoils />
      <GlobalCommunity />
    </main>
  );
};

export default WebsiteHome;