import GetStarted from "@spt/components/getStarted";
import BackToTopButton from "@spt/components/ui/backTotopBtn";

import FeaturedHeroSection from "./featuredHeroSection";
import InstitutionSpoils from "./institutionSpoils";
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
      <FeaturedHeroSection />
      <SkillsSpoils />
      <section id="third-section">
        <PromotedSpoils />
      </section>
      <InstitutionSpoils />
      <SpoilByCategory />
      <MostSubscribe />
      <PromotedAdsCarousel />
      <SelfDev />
      <TrendingSpoil />
      <GetStarted />
      <BackToTopButton/>
    </main>
  );
};

export default HomePage;
