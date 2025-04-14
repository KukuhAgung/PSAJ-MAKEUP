/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Image from "next/image"
import type React from "react"

import { Swiper, SwiperSlide } from "swiper/react"
import { Mousewheel } from "swiper/modules"
import { useRouter } from "next/navigation"
import AnimateButton from "@/components/molecules/animate-button/AnimateButton"
import { useState, useEffect } from "react"

import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/mousewheel"
import type { CarouselProps } from "./index.model"

import type { productCategory } from "@/app/(pages)/product/index.model"
import { useNavbar } from "@/context/NavbarContext"

export const ProductCarousel: React.FC<CarouselProps> = ({ items, mobile = false }) => {
  const { setActiveMenu } = useNavbar()
  const router = useRouter()
  const [products, setProducts] = useState(items)

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product")
        const data = await response.json()

        if (data.code === 200 && data.data) {
          // Map the API data to match our component's expected format
          const mappedProducts = data.data.map((product: any) => ({
            id: product.id,
            image: product.imageUrl,
            button: product.category as productCategory,
          }))
          setProducts(mappedProducts)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [])

  const navigateProduct = (value: productCategory) => {
    router.push(`/product?name=${value.toLowerCase()}`, { scroll: true })
    setActiveMenu("Produk")
    localStorage.setItem("storePath", "Produk")
  }

  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={mobile ? 1 : 3}
      mousewheel={{ forceToAxis: true }}
      scrollbar={{ draggable: true }}
      modules={[Mousewheel]}
      className="w-full overflow-hidden"
    >
      {products.map((item) => (
        <SwiperSlide key={item.id} className="relative">
          <Image
            loading="lazy"
            alt={`product-${item.id}`}
            src={item.image || "/placeholder.svg"}
            width={500}
            height={500}
            className="h-[590px] w-full rounded-lg object-cover"
          />
          <div className="absolute inset-0 flex items-end justify-center pb-10">
            <AnimateButton onclick={() => navigateProduct(item.button)}>{item.button}</AnimateButton>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
