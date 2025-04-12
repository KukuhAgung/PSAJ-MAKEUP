/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Mousewheel } from "swiper/modules"
import { Edit_foto } from "@/icons"
import Image from "next/image"

import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/mousewheel"
import type { ICarouselProps } from "../index.model"
import { PortfolioCard } from "@/components/molecules/portfolio-card"

interface ExtendedCarouselProps extends ICarouselProps {
  productId: string | number
}

export const Carousel: React.FC<ExtendedCarouselProps> = ({ items, onUpdate }) => {
  const fileInputRefs = useRef<HTMLInputElement[]>([])
  const [selectedItemId, setSelectedItemId] = useState<string | number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEditImage = (index: number, itemId: string | number) => {
    setSelectedItemId(itemId)
    fileInputRefs.current[index]?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string | number) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setSelectedItemId(itemId)
      setIsConfirmOpen(true)
    }
  }

  const handleConfirmImage = async () => {
    if (!selectedFile || selectedItemId === null) return

    setIsLoading(true)

    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("type", "gallery")

      // Upload the file
      const uploadResponse = await fetch("/api/product-service/upload", {
        method: "POST",
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (uploadResult.code === 200 && uploadResult.data && onUpdate && selectedItemId !== null) {
        const imageUrl = uploadResult.data.url
        
        // Type guard to check which function signature is being used
        const isItemUpdate = (fn: any): fn is (itemId: string | number, imageUrl: string) => void => {
          return fn.length === 2
        }

        if (isItemUpdate(onUpdate)) {
          onUpdate(selectedItemId, imageUrl)
        } else {
          const updatedItems = items.map(item => 
            item.id === selectedItemId ? {...item, image: imageUrl} : item
          )
          onUpdate(updatedItems)
        }
      }
    } catch (error) {
      console.error("Error uploading gallery image:", error)
    } finally {
      setIsLoading(false)
      setIsConfirmOpen(false)
      setSelectedFile(null)
      setSelectedItemId(null)
    }
  }

  const handleCancelImage = () => {
    setIsConfirmOpen(false)
    setSelectedFile(null)
    setSelectedItemId(null)
  }

  return (
    <>
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        mousewheel={{ forceToAxis: true }}
        scrollbar={{ draggable: true }}
        modules={[Mousewheel]}
        className="w-full overflow-hidden"
      >
        {items
          .sort((a, b) => b.id - a.id)
          .map((item, index) => (
            <SwiperSlide key={item.id} className="relative flex justify-center">
              <div className="relative">
                <PortfolioCard data={item} />
                <button
                  onClick={() => handleEditImage(index, item.id)}
                  className="absolute top-4 right-4 bg-amber-800 text-white rounded-full p-2 shadow-md hover:bg-amber-700 transition-colors z-10"
                  disabled={isLoading}
                >
                  <Edit_foto className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => {
                    if (el) fileInputRefs.current[index] = el
                  }}
                  className="hidden"
                  onChange={(e) => handleFileChange(e, item.id)}
                />
              </div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Image Confirmation Modal */}
      {isConfirmOpen && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Perubahan</h2>
            <p className="mb-4">Apakah Anda yakin ingin mengganti gambar galeri?</p>

            {/* Preview of the new image */}
            <div className="mb-4 flex justify-center">
              <Image
                src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                alt="Preview"
                width={200}
                height={200}
                className="rounded-md object-cover"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelImage}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmImage}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
