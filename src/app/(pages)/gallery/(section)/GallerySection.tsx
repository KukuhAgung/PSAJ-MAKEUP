import { GalleryData } from "../index.data";
import { PortfolioCard } from "@/components/molecules/portfolio-card";

export const GallerySection = () => {
  return (
    <section
      id="gallery"
      className="flex min-h-screen flex-col items-center justify-center gap-y-14 overflow-hidden rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20"
    >
      <div className="flex flex-col gap-y-10">
        <h1 className="text-center font-jakarta text-[56px] font-semibold">
          Galeri
        </h1>
        <h6 className="text-center font-jakarta text-base font-medium">
          Setiap wajah memiliki keunikan, dan kami hadir untuk mempercantiknya.
          Temukan inspirasi riasan terbaik di sini!
        </h6>
      </div>
      <article className="grid grid-cols-3 items-center gap-8">
        {GalleryData.map((item) => (
          <PortfolioCard key={item.id} data={item} />
        ))}
      </article>
    </section>
  );
};
