"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import { TestimoniCard } from "./TestimoniCard";
import { CarouselAction } from "./CarouselAction";
import React, { useState } from "react";
import { ITestimoniCarouselProps } from "../index.model";

export const TestimoniCarousel: React.FC<ITestimoniCarouselProps> = ({ items}) => {
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
      {items.map((item) => (
        <SwiperSlide key={item.id}>
          <TestimoniCard item={item} />
        </SwiperSlide>
      ))}
      <CarouselAction activeIndex={activeIndex} />
    </Swiper>
  );
};
