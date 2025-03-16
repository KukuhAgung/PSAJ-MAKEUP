"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import { ICarouselProps } from "../index.model";
import { PortfolioCard } from "@/components/molecules/portfolio-card";
import { Edit_foto } from "@/icons";
import { useState, useRef } from "react";

export const Carousel: React.FC<ICarouselProps> = ({ items }) => {
  const [carouselItems, setCarouselItems] = useState(items);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi untuk mengedit foto
  const handleEditPhoto = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageSrc = e.target?.result as string;

        // Memperbarui item dengan foto baru
        setCarouselItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, image: newImageSrc } : item
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={3}
      mousewheel={{ forceToAxis: true }}
      scrollbar={{ draggable: true }}
      modules={[Mousewheel]}
      className="w-full overflow-hidden"
    >
      {carouselItems.sort((a, b) => b.id - a.id).map((item) => (
        <SwiperSlide key={item.id} className="relative flex justify-center">
          {/* Portofolio Card */}
          <PortfolioCard data={item} />

          {/* Icon Edit */}
          <button
            onClick={() => {
              // Memicu input file secara programatik
              fileInputRef.current?.click();
            }}
            className="absolute top-4 right-4 bg-primary-500 p-2 rounded-full shadow-lg hover:bg-primary-700 transition"
          >
            <Edit_foto className="text-white w-6 h-6" />
          </button>

          {/* Input File Tersembunyi */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleEditPhoto(item.id, e)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};