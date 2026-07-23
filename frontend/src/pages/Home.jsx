import "./Home.css";

import "./Home.css";

import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import GreenHouseSection from "../components/home/GreenHouseSection";
import GallerySection from "../components/home/GallerySection";
import JournalPreview from "../components/home/JournalPreview";
import WeatherSection from "../components/home/WeatherSection";
import EncyclopediaSection from "../components/home/EncyclopediaSection";
import CTASection from "../components/home/CTASection";
import FooterSection from "../components/home/FooterSection";

export default function Home() {
  return (
    <main className="home-page">
      <HeroSection />
      <FeaturesSection />
      <GreenHouseSection />
      <GallerySection />
      <JournalPreview />
      <WeatherSection />
      <EncyclopediaSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}