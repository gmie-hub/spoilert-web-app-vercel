import GetStarted from "@spt/components/getStarted";

import InstitutionSpoils from "./institutionSpoils";
import HeroSlider from "./landingImage";
import MostSubscribe from "./mostSubscribe";
import PromotedAdsCarousel from "./PromotedAdsCarousel";
import PromotedSpoils from "./PromotedSpoils ";
import SelfDev from "./selfDev";
import SkillsSpoils from "./skills";
import SpoilByCategory from "./spoilByCat";
import TrendingSpoil from "./trendingSpoils";

const HomePage = () => {
  return (
    <main>
      <HeroSlider />
      <SkillsSpoils />
      <PromotedSpoils />
      <InstitutionSpoils />
      <SpoilByCategory />
      <MostSubscribe />
      <PromotedAdsCarousel />
      <SelfDev />
      <TrendingSpoil />
      <GetStarted />
    </main>
  );
};

export default HomePage;
