import FeatureSection from "@/components/home/FeatureSection";
import HeroSection from "@/components/home/HeroSection";
import ServiceSection from "@/components/home/ServiceSection";

export default function Home() {
  return (
    <main className="">
      <div className="max-w-[85rem] mx-auto pb-10 pt-[100px] px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <FeatureSection />
        <ServiceSection />
      </div>
    </main>
  );
}
