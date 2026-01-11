import GetStarted from "@spt/components/getStarted";

import Discover from "./discover";
import LearningPlatform from "./learningPlatform";
import WhyWeAreDifferent from "./whyWeAreDifferent";

const WebsiteHome = () => {
  return (
    <main>
      <Discover />
      <LearningPlatform />
      <WhyWeAreDifferent />
      <GetStarted/>
    </main>
  );
};

export default WebsiteHome;