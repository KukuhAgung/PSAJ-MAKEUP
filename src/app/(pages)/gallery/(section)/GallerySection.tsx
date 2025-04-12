"use client"

import { useState, useEffect } from "react"
import { PortfolioCard } from "@/components/molecules/portfolio-card"

interface GalleryItem {
  id: number
  imageUrl: string
  createdAt: string
  updatedAt: string
}

// Define the interface that PortfolioCard expects
interface IPortfolioData {
  id: number
  image: string
  // Add any other properties that PortfolioCard expects
}

export const GallerySection = () => {
  // State untuk menyimpan data galeri
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch gallery items on component mount
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/gallery-service/item")
        const data = await response.json()

        if (data.code === 200 && data.data) {
          setGalleryItems(data.data)
        }
      } catch (error) {
        console.error("Error fetching gallery items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGalleryItems()
  }, [])

  // Function to map GalleryItem to the format expected by PortfolioCard
  const mapToPortfolioData = (item: GalleryItem): IPortfolioData => {
    return {
      id: item.id,
      image: item.imageUrl,
      // Add any other properties that PortfolioCard expects
    }
  }

  return (
    <section
      id="gallery"
      className="flex min-h-screen flex-col items-center justify-center gap-y-14 overflow-hidden rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20"
    >
      <div className="flex flex-col gap-y-10">
        <h1 className="text-center font-jakarta text-[56px] font-semibold">Galeri</h1>
        <h6 className="text-center font-jakarta text-base font-medium">
          Setiap wajah memiliki keunikan, dan kami hadir untuk mempercantiknya. Temukan inspirasi riasan terbaik di
          sini!
        </h6>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <article className="grid grid-cols-3 items-center gap-8">
          {galleryItems.map((item) => (
            <div key={item.id} className="relative">
              {/* Portofolio Card - Map GalleryItem to the format expected by PortfolioCard */}
              <PortfolioCard data={mapToPortfolioData(item)} />
            </div>
          ))}
        </article>
      )}
    </section>
  )
}
