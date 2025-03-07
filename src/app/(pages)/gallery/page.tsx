import { GallerySection } from "./(section)/GallerySection";
import { HeroSection } from "./(section)/HeroSection";
import { ResultSection } from "./(section)/ResultSection";
import { ResultsSectionData } from "./index.data";

export default function Gallery() {
    return (
        <>
            <HeroSection />
            {ResultsSectionData.map((item, index) => (
                <ResultSection key={index} title={item.title} subtitle={item.subtitle} data={item.data} />
            ))}
            <GallerySection/>
        </>
    );
}