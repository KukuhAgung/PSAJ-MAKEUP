"use client"

import type React from "react"

import { useState, useRef } from "react"
import AnimateButton from "@/components/molecules/animate-button/AnimateButton"
import Image from "next/image"
import type { IProductSectionProps, IProductData } from "../index.model"
import { Edit_foto, EditIcon } from "@/icons"

export const ProductSection: React.FC<IProductSectionProps> = ({ data, onUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isImageConfirmOpen, setIsImageConfirmOpen] = useState(false)
  const [editedDescription, setEditedDescription] = useState(data.description)
  const [editedSubtitle, setEditedSubtitle] = useState(data.subtitle)
  const [productData, setProductData] = useState<IProductData>(data)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBannerEdit = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setIsImageConfirmOpen(true)
    }
  }

  const handleConfirmImage = async () => {
    if (!selectedFile) return

    setIsLoading(true)

    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("type", "banner")

      // Upload the file
      const uploadResponse = await fetch("/api/product-service/upload", {
        method: "POST",
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (uploadResult.code === 200 && uploadResult.data) {
        const imageUrl = uploadResult.data.url

        // Update local state
        const updatedData = {
          ...productData,
          banner: imageUrl,
        }
        setProductData(updatedData)

        // Call the parent update function
        if (onUpdate) onUpdate(updatedData)
      }
    } catch (error) {
      console.error("Error uploading banner image:", error)
    } finally {
      setIsLoading(false)
      setIsImageConfirmOpen(false)
      setSelectedFile(null)
    }
  }

  const handleCancelImage = () => {
    setIsImageConfirmOpen(false)
    setSelectedFile(null)
  }

  const openEditModal = () => {
    setEditedDescription(productData.description)
    setEditedSubtitle(productData.subtitle)
    setIsEditModalOpen(true)
  }

  const saveEdits = async () => {
    setIsLoading(true)

    try {
      const updatedData = {
        ...productData,
        description: editedDescription,
        subtitle: editedSubtitle,
      }

      // Update local state
      setProductData(updatedData)

      // Call the parent update function
      if (onUpdate) onUpdate(updatedData)
    } catch (error) {
      console.error("Error updating product content:", error)
    } finally {
      setIsLoading(false)
      setIsEditModalOpen(false)
    }
  }

  const cancelEdits = () => {
    setEditedDescription(productData.description)
    setEditedSubtitle(productData.subtitle)
    setIsEditModalOpen(false)
  }

  return (
    <section className="relative flex min-h-screen flex-col justify-center gap-y-14 rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20">
      <div className="flex flex-col gap-y-10">
        <h1 className="text-center font-jakarta text-[56px] font-semibold">{productData.title}</h1>
        <div className="relative flex flex-col items-center">
          <h6 className="text-center font-jakarta text-base font-medium">{productData.subtitle}</h6>
        </div>
      </div>
      <article className="relative grid w-full grid-cols-2 items-center gap-x-20 p-10">
        <div className="relative">
          <Image
            alt="banner"
            loading="lazy"
            src={productData.banner || "/placeholder.svg"}
            width={800}
            height={800}
            className="h-fit w-full object-cover drop-shadow-lg"
          />
          <button
            onClick={handleBannerEdit}
            className="absolute top-4 right-4 bg-amber-800 text-white rounded-full p-2 shadow-md hover:bg-amber-700 transition-colors"
            disabled={isLoading}
          >
            <Edit_foto className="w-5 h-5" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
        <aside className="flex flex-col justify-center gap-y-9">
          <div className="relative flex items-center">
            <h1 className="font-jakarta text-title-lg font-medium">Pilihan Layanan</h1>
            <button
              onClick={openEditModal}
              className="ml-3 bg-amber-800 text-white rounded-full p-2 shadow-md hover:bg-amber-700 transition-colors"
              disabled={isLoading}
            >
              <EditIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <p className="text-justify font-jakarta text-base font-medium text-black opacity-60">
              {productData.description}
            </p>
          </div>
          <AnimateButton>Pesan Sekarang</AnimateButton>
        </aside>
      </article>

      {/* Banner Image Confirmation Modal */}
      {isImageConfirmOpen && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Perubahan</h2>
            <p className="mb-4">Apakah Anda yakin ingin mengganti gambar banner?</p>

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

      {/* Content Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Content</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <textarea
                value={editedSubtitle}
                onChange={(e) => setEditedSubtitle(e.target.value)}
                className="w-full h-24 p-2 border border-gray-300 rounded-md mb-4"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full h-40 p-2 border border-gray-300 rounded-md mb-4"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelEdits}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                onClick={saveEdits}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute -right-10 -bottom-60 -z-10 h-[280px] w-[320px] bg-gradient-to-b from-primary-500 to-white opacity-70 blur-[88px]"></div>
    </section>
  )
}
