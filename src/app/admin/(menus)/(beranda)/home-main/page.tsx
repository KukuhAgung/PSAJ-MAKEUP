import { DescriptionSection } from "@/components/sections-admin/description-section"
import { HeroSection } from "@/components/sections-admin/hero-section"

export default function Home(){
    return (
        <section className="flex flex-col gap-y-16">
            <HeroSection/>
            <DescriptionSection/>
        </section>
    )
}