"use client"
import Button from "@/components/molecules/button/Button"
import type React from "react"

import { PortfolioCard } from "../../molecules/portfolio-card"
import { useState, useRef, useEffect } from "react"
import { Edit_foto } from "@/icons"
import ImageEditor from "../product-section/component/ImageEditor"
import type { IPortfolioData } from "../../molecules/portfolio-card/index.model"

// Toast notification component
const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${
        type === "success" ? "bg-primary-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      {message}
    </div>
  )
}

export const PortfolioSection = () => {
  const [portfolioItems, setPortfolioItems] = useState<IPortfolioData[]>([])
  const [isLoading, setIsLoading] = useState<number | null>(null)
  const [showConfirmation, setShowConfirmation] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [tempPreview, setTempPreview] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [cropData, setCropData] = useState<{
    x: number
    y: number
    width: number
    height: number
    scale: number
  } | null>(null)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Fetch portfolio items on component mount
  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const response = await fetch("/api/portfolio")
        const data = await response.json()

        if (data.code === 200 && data.data) {
          // Map the API data to match our component's expected format
          const mappedPortfolioItems = data.data.map((item: any) => ({
            id: item.id,
            image: item.imageUrl,
          }))
          setPortfolioItems(mappedPortfolioItems)
        }
      } catch (error) {
        console.error("Error fetching portfolio items:", error)
      }
    }

    fetchPortfolioItems()
  }, [])

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
  }

  const handleEditClick = (index: number, e: React.MouseEvent) => {
    // Prevent event propagation to other elements
    e.stopPropagation()

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]?.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, portfolioId: number) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create a temporary preview
    const imageUrl = URL.createObjectURL(file)
    setTempPreview(imageUrl)
    setSelectedFile(file)
    setShowConfirmation(portfolioId)
    setCropData(null) // Reset crop data for new image
  }

  const handleCropSave = (data: { x: number; y: number; width: number; height: number; scale: number }) => {
    setCropData(data)
  }

  const handleConfirmUpload = async () => {
    if (!selectedFile || showConfirmation === null) return

    const portfolioId = showConfirmation

    try {
      setIsLoading(portfolioId)
      setShowConfirmation(null)

      // Update the UI immediately with the temporary preview
      setPortfolioItems((prevItems) =>
        prevItems.map((item) => (item.id === portfolioId ? { ...item, image: tempPreview || item.image } : item)),
      )

      // Upload the file
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("portfolioId", portfolioId.toString())

      // Add crop data if available
      if (cropData) {
        formData.append("cropData", JSON.stringify(cropData))
      }

      const uploadResponse = await fetch("/api/portfolio/upload", {
        method: "POST",
        body: formData,
      })

      const uploadData = await uploadResponse.json()

      if (uploadData.code !== 200) {
        throw new Error(uploadData.message)
      }

      // Update the database with the new image URL
      const updateResponse = await fetch("/api/portfolio/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolioId: portfolioId,
          imageUrl: uploadData.data.url,
        }),
      })

      const updateData = await updateResponse.json()

      if (updateData.code !== 200) {
        throw new Error(updateData.message)
      }

      // Update the portfolio item in state with the final URL from the server
      setPortfolioItems((prevItems) =>
        prevItems.map((item) => (item.id === portfolioId ? { ...item, image: uploadData.data.url } : item)),
      )

      showToast("Portfolio image updated successfully", "success")
    } catch (error) {
      console.error("Error updating portfolio image:", error)
      showToast("Failed to update portfolio image", "error")
    } finally {
      setIsLoading(null)
      setSelectedFile(null)
      setCropData(null)
      if (tempPreview) {
        URL.revokeObjectURL(tempPreview)
        setTempPreview(null)
      }
    }
  }

  const handleCancelUpload = () => {
    setShowConfirmation(null)
    setSelectedFile(null)
    setCropData(null)
    if (tempPreview) {
      URL.revokeObjectURL(tempPreview)
      setTempPreview(null)
    }
  }

  return (
    <section
      id="gallery"
      className="relative flex min-h-screen flex-col items-center justify-center gap-y-14 overflow-hidden rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20"
    >
      <div className="absolute left-56 top-32 -z-10 h-[350px] w-[435px] bg-gradient-to-b from-primary-500 to-white opacity-70 blur-[136px]"></div>
      <div className="flex flex-col gap-y-10">
        <h1 className="text-center font-jakarta text-[56px] font-semibold">Portfolio</h1>
        <h6 className="text-center font-jakarta text-base font-medium">
          Periksa portofolio dan testimoni dari ratusan kali pengalaman selama lebih dari 5 tahun berkarir.
        </h6>
      </div>
      <article className="flex items-center gap-x-8">
        {portfolioItems.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Wrapper untuk PortfolioCard dengan tombol edit */}
            <PortfolioCard data={item} />

            {/* Tombol Edit */}
            <button
              onClick={(e) => handleEditClick(index, e)}
              className="absolute top-4 right-4 bg-primary-500 p-2 rounded-full shadow-lg hover:bg-primary-700 transition z-10"
              disabled={isLoading !== null}
            >
              <Edit_foto className="text-white w-6 h-6" />
            </button>

            {/* Loading indicator */}
            {isLoading === item.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}

            {/* Input file tersembunyi */}
            <input
              type="file"
              accept="image/*"
              ref={(el) => {
                fileInputRefs.current[index] = el
              }}
              onChange={(e) => handleFileChange(e, item.id)}
              className="hidden"
              disabled={isLoading !== null}
            />
          </div>
        ))}
      </article>
      <Button>Lihat Selengkapnya</Button>

      {/* Confirmation Popup with Image Editor */}
      {showConfirmation !== null && tempPreview && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
            <div className="flex flex-col gap-y-4">
              <h3 className="text-xl font-bold text-black">Konfirmasi Perubahan Gambar</h3>

              {/* Image Editor Component */}
              <ImageEditor src={tempPreview || "/placeholder.svg"} onSave={handleCropSave} />

              <div className="flex gap-x-4 justify-end mt-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  onClick={handleCancelUpload}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
                  onClick={handleConfirmUpload}
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  )
}
