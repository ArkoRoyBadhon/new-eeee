
import ContectSection from "./_components/homePage/ContectSection";
import DiscoverSection from "./_components/homePage/DiscoverSection";
import HeroSection from "./_components/homePage/HeroSection";
import HowItWork from "./_components/homePage/HowItWork";
import JoinSuplierSection from "./_components/homePage/JoinSuplierSection";
import MajorSection from "./_components/homePage/MajorSection";
import MarketSection from "./_components/homePage/MarketSection";
import PartnerSection from "./_components/homePage/PartnerSection";
import VerifiedExportersSection from "./_components/homePage/VerifiedExportersSection";

export const metadata = {
  title: "Home Page | King Mansa",
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <VerifiedExportersSection />
      <JoinSuplierSection />
      <HowItWork />
      <MajorSection />
      <DiscoverSection />
      <MarketSection />
      <ContectSection />
      <PartnerSection />
    </div>
  );
}
