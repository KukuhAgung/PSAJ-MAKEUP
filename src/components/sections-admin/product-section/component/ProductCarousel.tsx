"use client"
import Image from "next/image"
import type React from "react"

import { useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Mousewheel } from "swiper/modules"
import AnimateButton from "@/components/molecules/animate-button/AnimateButton"
import { Edit_foto } from "@/icons"
import type { CarouselProps } from "./index.model"

import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/mousewheel"

export const ProductCarousel: React.FC<CarouselProps> = ({ items }) => {
  const [products, setProducts] = useState(items)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleEditClick = (index: number, e: React.MouseEvent) => {
    // Mencegah event propagasi ke elemen lain
    e.stopPropagation();
    
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]?.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, productId: number) => {
    const file = event.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)

    // Update the product image
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === productId ? { ...product, image: imageUrl } : product)),
    )
  }

  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={3}
      mousewheel={{ forceToAxis: true }}
      scrollbar={{ draggable: true }}
      modules={[Mousewheel]}
      className="w-full overflow-hidden"
    >
      {products.map((item, index) => (
        <SwiperSlide key={item.id} className="relative">
          <div className="relative">
            <Image
              loading="lazy"
              alt={`product-${item.id}`}
              src={item.image || "/placeholder.svg"}
              width={500}
              height={500}
              className="h-[590px] w-full rounded-lg object-cover"
            />
            {/* Mengadopsi style tombol edit dari Hero Section */}
            <button
              onClick={(e) => handleEditClick(index, e)}
              className="absolute top-4 right-4 bg-primary-500 p-2 rounded-full shadow-lg hover:bg-primary-700 transition z-10"
            >
              <Edit_foto className="text-white w-6 h-6" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={(el) => {
                fileInputRefs.current[index] = el
              }}
              onChange={(e) => handleFileChange(e, item.id)}
              className="hidden"
            />
          </div>
          <div className="absolute inset-0 flex items-end justify-center pb-10">
            <AnimateButton>{item.button}</AnimateButton>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}