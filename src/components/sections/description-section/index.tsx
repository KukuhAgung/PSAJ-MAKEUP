/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AnimateButton from "@/components/molecules/animate-button/AnimateButton";
import Carousel from "./component/carousel";
import { useEffect, useState } from "react";
import { CarouselItem } from "./component/carousel/index.model";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import VideoPlay from "./component/carousel/component/VideoPlay";

export const DescriptionSection = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const [isLoading, setIsLoading] = useState(false);
  const [isOnPlay, setIsOnPlay] = useState<boolean>(false);
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
        console.error("Error fetching description videos:", error, isOnPlay);
      }
    };
    fetchDescriptionVideos();
  }, []);

  return (
    <section
      id="descriptionSection"
      className="relative min-h-[80vh] w-full grid-cols-2 items-center gap-x-20 p-10 md:grid"
    >
      <div className="absolute -left-32 top-20 -z-10 h-[350px] w-[435px] bg-gradient-to-b from-primary-500 to-white opacity-70 blur-[88px]"></div>
      <aside className="relative flex justify-center">
        {!mobile &&
          (isLoading ? (
            <Carousel
              items={carouselItems}
              baseWidth={600}
              autoplay={!mobile}
              autoplayDelay={3000}
              pauseOnHover={true}
              loop={true}
              round={false}
            />
          ) : (
            <div className="flex h-[527px] w-[545px] items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
            </div>
          ))}

        {mobile && (
          <div className="flex max-w-full flex-col gap-y-4">
            <h1 className="text-base font-medium text-gray-800">
              Geser untuk melihat
            </h1>
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              mousewheel={{ forceToAxis: true }}
              scrollbar={{ draggable: true }}
              modules={[Mousewheel]}
              className="w-full overflow-hidden"
            >
              {carouselItems.map((item) => (
                <SwiperSlide key={item.id} className="relative">
                  <VideoPlay src={item.video} setOnPlay={setIsOnPlay} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </aside>
      <article className="mt-5 flex flex-col justify-center gap-y-9 md:mt-0">
        <h1 className="font-jakarta text-title-md font-medium md:text-title-lg">
          Pesona Kecantikan <span className="block">Dalam Setiap</span> Sapuan
        </h1>
        <p className="text-justify font-jakarta text-sm font-medium text-black opacity-60 md:text-base">
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
