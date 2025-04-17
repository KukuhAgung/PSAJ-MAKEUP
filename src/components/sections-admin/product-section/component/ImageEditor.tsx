"use client"

import Image from "next/image"
import type React from "react"
import { useState, useRef, useEffect } from "react"

interface ImageEditorProps {
  src: string
  onSave: (cropData: { x: number; y: number; width: number; height: number; scale: number }) => void
}

const ImageEditor: React.FC<ImageEditorProps> = ({ src, onSave }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [scale, setScale] = useState(1)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  // Initialize image and container sizes
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setContainerSize({ width, height })
      
    }

    const img = document.createElement("img")
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight })

      // Calculate initial scale to fit the image in the container
      if (containerRef.current) {
        const { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect()
        const initialScale = Math.min(containerWidth / img.naturalWidth, containerHeight / img.naturalHeight)
        setScale(initialScale)
      }
    }
    console.log(containerSize);
    
    img.src = src
  }, [src, containerSize])

  // Handle zoom
  const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = Number.parseFloat(e.target.value)
    setScale(newScale)
  }

  // Save the crop data
  const handleSave = () => {
    if (!containerRef.current || !imageRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()

    // Calculate the center position
    const centerX = (imageSize.width - containerRect.width / scale) / 2
    const centerY = (imageSize.height - containerRect.height / scale) / 2

    // Ensure we don't go out of bounds
    const visibleX = Math.max(0, centerX)
    const visibleY = Math.max(0, centerY)
    const visibleWidth = Math.min(imageSize.width, containerRect.width / scale)
    const visibleHeight = Math.min(imageSize.height, containerRect.height / scale)

    onSave({
      x: visibleX,
      y: visibleY,
      width: visibleWidth,
      height: visibleHeight,
      scale: scale,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div ref={containerRef} className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            ref={imageRef}
            src={src || "/placeholder.svg"}
            alt="Edit preview"
            className="pointer-events-none"
            style={{
              transform: `scale(${scale})`,
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
        <div className="absolute inset-0 border-2 border-primary-500 pointer-events-none"></div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Zoom: {scale.toFixed(1)}x</label>
        <input type="range" min="0.1" max="3" step="0.1" value={scale} onChange={handleZoom} className="w-full" />
      </div>

      <p className="text-sm text-gray-500">Use the slider to zoom in or out</p>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
      >
        Apply Changes
      </button>
    </div>
  )
}

export default ImageEditor
