"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import { ICarouselProps } from "../index.model";
import { PortfolioCard } from "@/components/molecules/portfolio-card";

export const Carousel: React.FC<ICarouselProps> = ({ items }) => {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={3}
      mousewheel={{ forceToAxis: true }}
      scrollbar={{ draggable: true }}
      modules={[Mousewheel]}
      className="w-full overflow-hidden"
    >
      {items.sort((a, b) => b.id - a.id).map((item) => (
        <SwiperSlide key={item.id} className="relative flex justify-center">
          <PortfolioCard data={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
