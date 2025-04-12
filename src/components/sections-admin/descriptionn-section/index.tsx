"use client"
import AnimateButton from "@/components/molecules/animate-button/AnimateButton"
import type React from "react"

import { useState, useEffect, useRef } from "react"
import Carousel from "./component/carousel"
import { Edit_foto } from "@/icons"
import type { CarouselItem } from "./component/carousel/index.model"

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

export const DescriptionSection = () => {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([])
  const [isLoading, setIsLoading] = useState<number | null>(null)
  const [showConfirmation, setShowConfirmation] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Fetch description videos on component mount
  useEffect(() => {
    const fetchDescriptionVideos = async () => {
      try {
        const response = await fetch("/api/description")
        const data = await response.json()

        if (data.code === 200 && data.data) {
          // Map the API data to match our component's expected format
          const mappedCarouselItems = data.data.map((item: any) => ({
            id: item.id,
            video: item.videoUrl,
          }))
          setCarouselItems(mappedCarouselItems)
        }
      } catch (error) {
        console.error("Error fetching description videos:", error)
      }
    }

    fetchDescriptionVideos()
  }, [])

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
  }

  const handleEditClick = (index: number) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]?.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, videoId: number) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check if the file is a video
    if (!file.type.startsWith("video/")) {
      showToast("Please select a video file", "error")
      return
    }

    setSelectedFile(file)
    setShowConfirmation(videoId)
  }

  const handleConfirmUpload = async () => {
    if (!selectedFile || showConfirmation === null) return

    const videoId = showConfirmation

    try {
      setIsLoading(videoId)
      setShowConfirmation(null)

      // Upload the file
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("videoId", videoId.toString())

      const uploadResponse = await fetch("/api/description/upload", {
        method: "POST",
        body: formData,
      })

      const uploadData = await uploadResponse.json()

      if (uploadData.code !== 200) {
        throw new Error(uploadData.message)
      }

      // Update the database with the new video URL
      const updateResponse = await fetch("/api/description/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: videoId,
          videoUrl: uploadData.data.url,
        }),
      })

      const updateData = await updateResponse.json()

      if (updateData.code !== 200) {
        throw new Error(updateData.message)
      }

      // Update the carousel item in state with the final URL from the server
      setCarouselItems((prevItems) =>
        prevItems.map((item) => (item.id === videoId ? { ...item, video: uploadData.data.url } : item)),
      )

      showToast("Video updated successfully", "success")
    } catch (error) {
      console.error("Error updating video:", error)
      showToast("Failed to update video", "error")
    } finally {
      setIsLoading(null)
      setSelectedFile(null)
    }
  }

  const handleCancelUpload = () => {
    setShowConfirmation(null)
    setSelectedFile(null)
  }

  return (
    <section className="relative grid min-h-[80vh] w-full grid-cols-2 items-center gap-x-20 p-10">
      <div className="absolute -left-32 top-20 -z-10 h-[350px] w-[435px] bg-gradient-to-b from-primary-500 to-white blur-[88px] opacity-70"></div>
      <aside className="relative flex justify-center">
        <div className="relative">
          <Carousel
            items={carouselItems}
            baseWidth={600}
            autoplay={true}
            autoplayDelay={3000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
          {/* Edit buttons for each video */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => handleEditClick(index)}
                className="bg-primary-500 p-2 rounded-full shadow-lg hover:bg-primary-700 transition"
                disabled={isLoading !== null}
              >
                <Edit_foto className="text-white w-6 h-6" />
                <input
                  type="file"
                  accept="video/*"
                  ref={(el) => {
                    fileInputRefs.current[index] = el
                  }}
                  onChange={(e) => handleFileChange(e, index + 1)} // +1 because IDs start from 1
                  className="hidden"
                  disabled={isLoading !== null}
                />
              </button>
            ))}
          </div>
          {/* Loading indicator */}
          {isLoading !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg z-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </aside>
      <article className="flex flex-col justify-center gap-y-9">
        <h1 className="font-jakarta text-title-lg font-medium">
          Pesona Kecantikan <span className="block">Dalam Setiap</span> Sapuan
        </h1>
        <p className="text-justify font-jakarta text-base font-medium text-black opacity-60">
          Setiap wajah memiliki keunikan, dan setiap sentuhan riasan membawa cerita tersendiri. Melalui video-video ini,
          lihat bagaimana kami menghadirkan tampilan terbaik untuk setiap momen spesial Anda. Dari riasan natural hingga
          glamor, semua dikerjakan dengan detail dan profesionalisme.
        </p>
        <AnimateButton>Lihat Produk</AnimateButton>
      </article>

      {/* Confirmation Popup */}
      {showConfirmation !== null && selectedFile && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
            <div className="flex flex-col gap-y-4">
              <h3 className="text-xl font-bold text-black">Konfirmasi Perubahan Video</h3>

              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <video src={URL.createObjectURL(selectedFile)} className="w-full h-full object-cover" controls muted />
              </div>

              <p className="text-black opacity-70">Konfirmasi mengganti video ini?</p>

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
