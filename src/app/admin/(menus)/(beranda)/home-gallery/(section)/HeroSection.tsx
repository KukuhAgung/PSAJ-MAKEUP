"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Button from "@/components/molecules/button/Button"
import Image from "next/image"
import { Rozha_One } from "next/font/google"
import { Edit_foto } from "@/icons"
import { X } from "lucide-react"

const rozha = Rozha_One({
  weight: "400",
  subsets: ["latin"],
})

export const HeroSection = () => {
  const [imageUrl, setImageUrl] = useState<string>("/images/grid-image/gallery-hero.png")
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [tempPreview, setTempPreview] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const preview = URL.createObjectURL(file)
      setTempPreview(preview)
      setShowConfirmation(true)
    }
  }

  const handleConfirmUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setShowConfirmation(false)

    try {
      // Create form data for upload
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("type", "hero")

      // Upload the file
      const uploadResponse = await fetch("/api/gallery-service/upload", {
        method: "POST",
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (uploadResult.code === 200 && uploadResult.data) {
        // Update the hero gallery with the new image URL
        const updateResponse = await fetch("/api/gallery-service/hero", {
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
          setImageUrl(uploadResult.data.url)
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
      setSelectedFile(null)
      if (tempPreview) {
        URL.revokeObjectURL(tempPreview)
        setTempPreview(null)
      }
    }
  }

  const handleCancelUpload = () => {
    setShowConfirmation(false)
    setSelectedFile(null)
    if (tempPreview) {
      URL.revokeObjectURL(tempPreview)
      setTempPreview(null)
    }
  }

  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <section className="grid min-h-[90vh] w-full grid-cols-2 items-center rounded-xl bg-gradient-to-l from-primary-500 via-primary-50 to-primary-25 p-10">
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
          <div className="relative flex w-[80%] items-center rounded-3xl border border-white border-opacity-60 bg-white bg-opacity-25 px-8 py-10">
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

              {/* Gambar yang bisa diedit */}
              <Image
                priority
                alt="hero-img"
                src={imageUrl || "/placeholder.svg"}
                width={490}
                height={490}
                className="mask-image relative drop-shadow-2xl"
              />

              {/* Icon Edit */}
              <button
                onClick={handleEditClick}
                disabled={isUploading}
                className={`absolute right-4 top-4 rounded-full bg-primary-500 p-2 shadow-lg transition hover:bg-primary-700 ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Edit_foto className="h-6 w-6 text-white" />
              </button>

              {/* Input File Hidden */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageSelect}
                disabled={isUploading}
              />
            </div>
          </div>
        </aside>
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

            {tempPreview && (
              <div className="mb-4 flex justify-center">
                <div className="relative h-48 w-48 overflow-hidden rounded-lg">
                  <Image src={tempPreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
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
