import Button from "@/components/molecules/button/Button";
import Image from "next/image";
import { Rozha_One } from "next/font/google";

const rozha = Rozha_One({
  weight: "400",
  subsets: ["latin"],
});

export const HeroSection = () => {
  return (
    <section className="grid min-h-[90vh] w-full grid-cols-2 items-center rounded-xl bg-gradient-to-bl from-primary-25 via-primary-50 to-primary-200 p-10">
      <article className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-2">
          <h1
            className={`${rozha.className} text-title-3xl font-bold text-black dark:text-white/90`}
          >
            Jelajahi Semua
            <span className="inline-block text-primary-500">Produk</span>
          </h1>
        </div>
        <p className="w-[534px] text-justify font-jakarta text-base font-medium text-black opacity-45 dark:text-white/90">
          Detail kategori makeup yang dapat kamu pilih untuk sesuaikan riasanmu
          dengan hari paling penting yang kamu tunggu-tunggu.
        </p>
        <div className="flex items-center gap-x-4">
          <Button size="md">Pesan Sekarang</Button>
          <Button size="md" variant="outline" transparent>
            Lihat Selengkapnya
          </Button>
        </div>
      </article>

      <aside className="flex h-full items-center justify-center">
        <div className="flex w-[80%] items-center rounded-3xl border border-white border-opacity-60 bg-white bg-opacity-25 px-8 py-10">
          <div className="relative flex w-fit rounded-xl px-8 py-10">
            {/* Shape sebagai Masking */}
            <Image
              priority
              alt="hero-shape"
              src="/images/shape/hero-shape.svg"
              width={420}
              height={420}
              className="mask-image absolute left-0 top-0 h-full w-full drop-shadow-lg"
            />

            {/* Gambar yang akan dimasking */}
            <Image
              priority
              alt="hero-img"
              src="/images/grid-image/product-hero.png"
              width={490}
              height={490}
              className="mask-image relative drop-shadow-2xl"
            />
          </div>
        </div>
      </aside>
    </section>
  );
};
