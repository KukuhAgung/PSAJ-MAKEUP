"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { PortfolioCard } from "@/components/molecules/portfolio-card"
import { Edit_foto } from "@/icons"
import { X } from "lucide-react"
import Image from "next/image"

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

interface SelectedImage {
  file: File
  preview: string
  itemId: number
}

export const GallerySection = () => {
  // State untuk menyimpan data galeri
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadingId, setUploadingId] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Ref untuk input file
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

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

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (selectedImage?.preview) {
        URL.revokeObjectURL(selectedImage.preview)
      }
    }
  }, [selectedImage])

  // Fungsi untuk memilih foto
  const handleSelectPhoto = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      setSelectedImage({
        file,
        preview,
        itemId: id,
      })
      setShowConfirmation(true)
    }
  }

  // Fungsi untuk mengkonfirmasi upload
  const handleConfirmUpload = async () => {
    if (!selectedImage) return

    const { file, itemId } = selectedImage
    setUploadingId(itemId)
    setShowConfirmation(false)

    try {
      // Create form data for upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "gallery")
      formData.append("itemId", itemId.toString())

      // Upload the file
      const uploadResponse = await fetch("/api/gallery-service/upload", {
        method: "POST",
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (uploadResult.code === 200 && uploadResult.data) {
        // Update the gallery item with the new image URL
        const updateResponse = await fetch("/api/gallery-service/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "gallery",
            itemId: itemId.toString(),
            imageUrl: uploadResult.data.url,
          }),
        })

        const updateResult = await updateResponse.json()

        if (updateResult.code === 200 && updateResult.data) {
          // Update the local state with the new image
          setGalleryItems((prevItems) =>
            prevItems.map((item) => (item.id === itemId ? { ...item, imageUrl: uploadResult.data.url } : item)),
          )
        }
      }
    } catch (error) {
      console.error("Error updating gallery item:", error)
    } finally {
      setUploadingId(null)
      setSelectedImage(null)
    }
  }

  // Fungsi untuk membatalkan upload
  const handleCancelUpload = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview)
    }
    setSelectedImage(null)
    setShowConfirmation(false)
  }

  // Function to map GalleryItem to the format expected by PortfolioCard
  const mapToPortfolioData = (item: GalleryItem): IPortfolioData => {
    return {
      id: item.id,
      image: item.imageUrl,
      // Add any other properties that PortfolioCard expects
    }
  }

  return (
    <>
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

                {/* Icon Edit */}
                <button
                  onClick={() => {
                    // Memicu input file untuk foto tertentu
                    fileInputRefs.current[item.id]?.click()
                  }}
                  disabled={uploadingId !== null}
                  className={`absolute right-4 top-4 rounded-full bg-primary-500 p-2 shadow-lg transition hover:bg-primary-700 ${
                    uploadingId !== null ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Edit_foto className="h-6 w-6 text-white" />
                </button>

                {/* Input File Tersembunyi untuk Foto Tertentu */}
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => {
                    if (el) fileInputRefs.current[item.id] = el
                  }}
                  className="hidden"
                  onChange={(e) => handleSelectPhoto(item.id, e)}
                  disabled={uploadingId !== null}
                />
              </div>
            ))}
          </article>
        )}
      </section>

      {/* Inline Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Perubahan Gambar</h3>
              <button onClick={handleCancelUpload} className="rounded-full p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {selectedImage?.preview && (
              <div className="mb-4 flex justify-center">
                <div className="relative h-48 w-48 overflow-hidden rounded-lg">
                  <Image
                    src={selectedImage.preview || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <p className="mb-6 text-sm text-gray-600">
              Apakah Anda yakin ingin mengubah gambar ini? Gambar akan diperbarui di semua halaman yang menampilkannya.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelUpload}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmUpload}
                className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
