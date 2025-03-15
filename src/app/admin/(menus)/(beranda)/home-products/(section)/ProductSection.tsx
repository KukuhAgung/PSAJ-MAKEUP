"use client"

import type React from "react"

import { useState, useRef } from "react"
import AnimateButton from "@/components/molecules/animate-button/AnimateButton"
import Image from "next/image"
import type { IProductSectionProps, IProductData } from "../index.model"
import { Edit_foto, EditIcon } from "@/icons"

export const ProductSection: React.FC<IProductSectionProps> = ({ data }) => {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)
  const [editedDescription, setEditedDescription] = useState(data.description)
  const [productData, setProductData] = useState<IProductData>(data)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBannerEdit = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setProductData({
        ...productData,
        banner: imageUrl,
      })
    }
  }

  const openDescriptionModal = () => {
    setEditedDescription(productData.description)
    setIsDescriptionModalOpen(true)
  }

  const saveDescription = () => {
    setProductData({
      ...productData,
      description: editedDescription,
    })
    setIsDescriptionModalOpen(false)
  }

  const cancelDescriptionEdit = () => {
    setEditedDescription(productData.description)
    setIsDescriptionModalOpen(false)
  }

  return (
    <section className="flex min-h-screen flex-col justify-center gap-y-14 overflow-hidden rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20">
      <div className="flex flex-col gap-y-10">
        <h1 className="text-center font-jakarta text-[56px] font-semibold">{productData.title}</h1>
        <h6 className="text-center font-jakarta text-base font-medium">{productData.subtitle}</h6>
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
          >
            <Edit_foto className="w-5 h-5" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
        <aside className="flex flex-col justify-center gap-y-9">
          <div className="relative flex items-center">
            <h1 className="font-jakarta text-title-lg font-medium">Pilihan Layanan</h1>
            <button
              onClick={openDescriptionModal}
              className="ml-3 bg-amber-800 text-white rounded-full p-2 shadow-md hover:bg-amber-700 transition-colors"
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

      {/* Description Edit Modal */}
      {isDescriptionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Deskripsi</h2>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full h-40 p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDescriptionEdit}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveDescription}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

