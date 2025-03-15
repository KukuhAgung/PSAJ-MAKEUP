import { DescriptionSection } from "@/components/sections-admin/description-section";
import { HeroSection } from "@/components/sections-admin/hero-section";
import { ServicesSections } from "@/components/sections-admin/services-section";
import { ProductSection } from "@/components/sections-admin/product-section";
import { PortfolioSection } from "@/components/sections-admin/portfolio-section";
import { TestimoniSection } from "@/components/sections-admin/testimoni-section";

export default function Home() {
    return (
        <section className="flex flex-col items-center w-full gap-y-16 px-4 lg:px-16 mr-1 -translate-x-5">
            <div className="w-full max-w-7xl">
                <HeroSection />
            </div>
            <div className="w-full max-w-7xl">
                <DescriptionSection />
            </div>
            <div className="w-full max-w-7xl">
                <ServicesSections />
            </div>
            <div className="w-full max-w-7xl">
                <ProductSection />
            </div>
            <div className="w-full max-w-7xl">
                <PortfolioSection />
            </div>
            <div className="w-full max-w-7xl">
                <TestimoniSection />
            </div>
        </section>
    );
}
