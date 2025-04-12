"use client"

import { useState, useEffect } from "react"
import Button from "@/components/molecules/button/Button"
import Image from "next/image"
import { Rozha_One } from "next/font/google"

const rozha = Rozha_One({
  weight: "400",
  subsets: ["latin"],
})

export const HeroSection = () => {
  const [imageUrl, setImageUrl] = useState<string>("/images/grid-image/gallery-hero.png")

  // Fetch hero image on component mount
  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch("/api/gallery-service/hero")
        const data = await response.json()

        if (data.code === 200 && data.data) {
          setImageUrl(data.data.imageUrl)
        }
      } catch (error) {
        console.error("Error fetching hero image:", error)
      }
    }

    fetchHeroImage()
  }, [])

  return (
    <section className="grid min-h-[90vh] w-full grid-cols-2 items-center rounded-xl bg-gradient-to-br from-primary-200 via-primary-50 to-primary-25 p-10">
      <article className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-2">
          <h1 className={`${rozha.className} text-title-3xl font-bold text-black dark:text-white/90`}>
            Simak <span className="text-primary-500">Galeri</span>
            <span className="inline-block">Kami</span>
          </h1>
        </div>
        <p className="w-[534px] text-justify font-jakarta text-base font-medium text-black opacity-45 dark:text-white/90">
          Galeri foto hasil make up dengan berbagai kategori produk make up agar dapat lebih meyakinkan anda untuk
          melibatkan kami dalam berbagai momen penting.
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
              src={imageUrl || "/placeholder.svg"}
              width={490}
              height={490}
              className="mask-image relative drop-shadow-2xl"
            />
          </div>
        </div>
      </aside>
    </section>
  )
}
