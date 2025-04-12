import { GallerySection } from "./(section)/GallerySection";
import { HeroSection } from "./(section)/HeroSection";


export default function Gallery() {
  return (
    <section className="mr-1 flex w-full -translate-x-5 flex-col items-center gap-y-16 px-4 lg:px-16">
      <div className="w-full max-w-7xl">
        <HeroSection />
      </div>
      <div className="w-full max-w-7xl">
        <GallerySection />
      </div>
    </section>
  );
}
