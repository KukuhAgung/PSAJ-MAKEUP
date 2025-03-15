"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import { TestimoniCard } from "./TestimoniCard";
import { CarouselAction } from "./CarouselAction";
import { useState } from "react";

export const TestimoniCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Swiper
      spaceBetween={15}
      slidesPerView={3}
      scrollbar={{ draggable: true }}
      modules={[Pagination, Navigation, Scrollbar]}
      onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      className="w-full overflow-hidden"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <SwiperSlide key={index}>
          <TestimoniCard />
        </SwiperSlide>
      ))}
      <CarouselAction activeIndex={activeIndex} />
    </Swiper>
  );
};
