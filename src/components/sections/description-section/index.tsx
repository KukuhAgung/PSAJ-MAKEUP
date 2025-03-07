"use client"
import AnimateButton from "@/components/molecules/animate-button/AnimateButton";
import Carousel from "./component/carousel";
export const DescriptionSection = () => {
    return (
      <section className="relative grid min-h-[80vh] w-full grid-cols-2 items-center gap-x-20 p-10">
        <div className="absolute -left-32 top-20 -z-10 h-[350px] w-[435px] bg-gradient-to-b from-primary-500 to-white blur-[88px] opacity-70"></div>
        <aside className="relative flex justify-center">
          <Carousel
            baseWidth={600}
            autoplay={true}
            autoplayDelay={3000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
        </aside>
        <article className="flex flex-col justify-center gap-y-9">
          <h1 className="font-jakarta text-title-lg font-medium">
            Pesona Kecantikan <span className="block">Dalam Setiap</span> Sapuan
          </h1>
          <p className="text-justify font-jakarta text-base font-medium text-black opacity-60">
            Setiap wajah memiliki keunikan, dan setiap sentuhan riasan membawa
            cerita tersendiri. Melalui video-video ini, lihat bagaimana kami
            menghadirkan tampilan terbaik untuk setiap momen spesial Anda. Dari
            riasan natural hingga glamor, semua dikerjakan dengan detail dan
            profesionalisme.
          </p>
          {/* <Button size="md" className="w-[180px]" endIcon={(
                    <div className="absolute right-2 w-fit h-fit rounded-full bg-white text-black px-2 py-2"><ArrowRightIcon/></div>
                )}>Lihat Produk</Button> */}
          <AnimateButton>Lihat Produk</AnimateButton>
        </article>
      </section>
    );
};