/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AnimateButton from "@/components/molecules/animate-button/AnimateButton";
import Carousel from "./component/carousel";
import { useEffect, useState } from "react";
import { CarouselItem } from "./component/carousel/index.model";
export const DescriptionSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);

  useEffect(() => {
    const fetchDescriptionVideos = async () => {
      try {
        const response = await fetch("/api/description");
        const data = await response.json();

        if (data.code === 200 && data.data) {
          const mappedCarouselItems = data.data.map((item: any) => ({
            id: item.id,
            video: item.videoUrl,
          }));
          setCarouselItems(mappedCarouselItems);
          setIsLoading(true);
        }
      } catch (error) {
        console.error("Error fetching description videos:", error);
      }
    };
    fetchDescriptionVideos();
  }, []);

  return (
    <section className="relative grid min-h-[80vh] w-full grid-cols-2 items-center gap-x-20 p-10">
      <div className="absolute -left-32 top-20 -z-10 h-[350px] w-[435px] bg-gradient-to-b from-primary-500 to-white opacity-70 blur-[88px]"></div>
      <aside className="relative flex justify-center">
        {isLoading ? (
          <Carousel
            items={carouselItems}
            baseWidth={600}
            autoplay={true}
            autoplayDelay={3000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
        ) : (
          <div className="h-full w-[300px] flex items-center justify-center rounded-xl">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
          </div>
        )}
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
