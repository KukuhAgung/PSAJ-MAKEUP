import { DescriptionSection } from "@/components/sections/description-section";
import { HeroSection } from "@/components/sections/hero-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { ProdukSection } from "@/components/sections/product-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TestimoniSection } from "@/components/sections/testimoni-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <DescriptionSection />
      <ServicesSection />
      <ProdukSection />
      <PortfolioSection />
      <TestimoniSection />
    </>
  );
}
