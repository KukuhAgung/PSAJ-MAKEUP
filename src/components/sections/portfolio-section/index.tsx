import Button from "@/components/molecules/button/Button";
import { PortfolioCard } from "../../molecules/portfolio-card";
import { PortfolioData } from "./index.data";

export const PortfolioSection = () => {
  return (
    <section
      id="gallery"
      className="relative flex min-h-screen flex-col items-center justify-center gap-y-14 overflow-hidden rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20"
    >
      <div className="absolute left-56 top-32 -z-10 h-[350px] w-[435px] bg-gradient-to-b bg-primary-500 blur-[136px] opacity-70"></div>
      <div className="flex flex-col gap-y-10">
        <h1 className="text-center font-jakarta text-[56px] font-semibold">
          Portfolio
        </h1>
        <h6 className="text-center font-jakarta text-base font-medium">
          Periksa portofolio dan testimoni dari ratusan kali pengalaman selama
          lebih dari 5 tahun berkarir.
        </h6>
      </div>
      <article className="flex items-center gap-x-8">
        {PortfolioData.map((item) => (
          <PortfolioCard key={item.id} data={item} />
        ))}
      </article>
      <Button>Lihat Selengkapnya</Button>
    </section>
  );
};
