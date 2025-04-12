"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Button from "@/components/molecules/button/Button"
import Image from "next/image"
import { Rozha_One } from "next/font/google"
import { Edit_foto } from "@/icons"

const rozha = Rozha_One({
  weight: "400",
  subsets: ["latin"],
})

export const HeroSection = () => {
  // State for hero image and loading state
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch hero image on component mount
  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch("/api/product-service/hero")
        const result = await response.json()

        if (result.code === 200 && result.data) {
          setImagePreview(result.data.imageUrl)
        }
      } catch (error) {
        console.error("Error fetching hero image:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHeroImage()
  }, [])

  // Handler for image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Show confirmation dialog instead of setting immediately
      setShowConfirmation(true)
    }
  }

  // Handler for edit button click
  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  // Handler for confirmation dialog
  const handleConfirm = async () => {
    if (!selectedFile) return

    setIsLoading(true)

    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("type", "hero")

      // Upload the file
      const uploadResponse = await fetch("/api/product-service/upload", {
        method: "POST",
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (uploadResult.code === 200 && uploadResult.data) {
        // Update hero section with new image URL
        const updateResponse = await fetch("/api/product-service/hero/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: uploadResult.data.url,
          }),
        })

        const updateResult = await updateResponse.json()

        if (updateResult.code === 200) {
          // Update the preview with the new image
          setImagePreview(uploadResult.data.url)
        }
      }
    } catch (error) {
      console.error("Error updating hero image:", error)
    } finally {
      setIsLoading(false)
      setShowConfirmation(false)
      setSelectedFile(null)
    }
  }

  // Handler for cancellation
  const handleCancel = () => {
    setShowConfirmation(false)
    setSelectedFile(null)
  }

  return (
    <section className="grid min-h-[90vh] w-full grid-cols-2 items-center rounded-xl bg-gradient-to-bl from-primary-25 via-primary-50 to-primary-200 p-10">
      <article className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-2">
          <h1 className={`${rozha.className} text-title-3xl font-bold text-black dark:text-white/90`}>
            Jelajahi Semua
            <span className="inline-block text-primary-500">Produk</span>
          </h1>
        </div>
        <p className="w-[534px] text-justify font-jakarta text-base font-medium text-black opacity-45 dark:text-white/90">
          Detail kategori makeup yang dapat kamu pilih untuk sesuaikan riasanmu dengan hari paling penting yang kamu
          tunggu-tunggu.
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
            {!isLoading && (
              <Image
                priority
                alt="hero-img"
                src={imagePreview || "/images/grid-image/product-hero.png"}
                width={490}
                height={490}
                className="mask-image relative drop-shadow-2xl"
              />
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="mask-image relative flex items-center justify-center w-[490px] h-[490px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            )}

            {/* Tombol Edit */}
            <button
              onClick={handleEditClick}
              className="absolute right-4 top-4 rounded-full bg-primary-500 p-2 shadow-lg transition hover:bg-primary-700"
              disabled={isLoading}
            >
              <Edit_foto className="h-6 w-6 text-white" />
            </button>

            {/* Input File Tersembunyi */}
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
          </div>
        </div>
      </aside>

      {/* Confirmation Dialog */}
      {showConfirmation && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Perubahan</h2>
            <p className="mb-4">Apakah Anda yakin ingin mengganti gambar hero?</p>

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
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
