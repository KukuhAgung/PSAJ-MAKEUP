"use client"
import type { JSX } from "react"
import { useEffect, useState, useRef } from "react"
import { motion, type PanInfo, useMotionValue, useTransform } from "framer-motion"
import type { CarouselProps } from "./index.model"
import VideoPlay from "./component/VideoPlay"
import { carouselData } from "./index.data";

const DRAG_BUFFER = 0
const VELOCITY_THRESHOLD = 500
const GAP = 16
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 }

export default function Carousel({
  items = [],
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
}: CarouselProps): JSX.Element {
  const containerPadding = 22
  const itemWidth = baseWidth - containerPadding * 2
  const trackItemOffset = itemWidth + GAP

  const carouselItems = loop && items.length > 0 ? [...items, items[0]] : items
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const x = useMotionValue(0)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isResetting, setIsResetting] = useState<boolean>(false)
  const [isOnPlay, setIsOnPlay] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const ranges = items.map((_, index) => [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ])
  const outputRange = [90, 0, -90]
  const rotateYValues = ranges.map((range) => useTransform(x, range, outputRange, { clamp: false }))

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current
      const handleMouseEnter = () => setIsHovered(true)
      const handleMouseLeave = () => setIsHovered(false)
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [pauseOnHover])

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered) && !isOnPlay && items.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === items.length - 1 && loop) {
            return prev + 1 // Animate to clone.
          }
          if (prev === carouselItems.length - 1) {
            return loop ? 0 : prev
          }
          return prev + 1
        })
      }, autoplayDelay)
      return () => clearInterval(timer)
    }
  }, [autoplay, autoplayDelay, isHovered, isOnPlay, loop, items.length, carouselItems.length, pauseOnHover])

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true)
      x.set(0)
      setCurrentIndex(0)
      setTimeout(() => setIsResetting(false), 50)
    }
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const offset = info.offset.x
    const velocity = info.velocity.x
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (loop && currentIndex === items.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1))
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (loop && currentIndex === 0) {
        setCurrentIndex(items.length - 1)
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0))
      }
    }
  }

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * (carouselItems.length - 1),
          right: 0,
        },
      }

  // If no items, show a placeholder
  if (items.length === 0) {
    return (
      <div
        className="relative overflow-hidden p-5 rounded-[24px] border border-white bg-primary-500 bg-opacity-10 flex items-center justify-center"
        style={{
          width: `${baseWidth}px`,
          height: `${baseWidth}px`,
        }}
      >
        <p className="text-center text-gray-500">Loading videos...</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden p-5 rounded-[24px] border border-white bg-primary-500 bg-opacity-10"
      style={{
        width: `${baseWidth}px`,
        ...(round && { height: `${baseWidth}px` }),
      }}
    >
      <motion.div
        className="flex"
        drag="x"
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
          x,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        {carouselItems.map((item, index) => {
          const rotateY = rotateYValues[index]
          return (
            <motion.div
              key={index}
              className={`relative shrink-0 flex flex-col ${
                round
                  ? "items-center justify-center text-center border-0"
                  : "items-start justify-between border rounded-[12px]"
              } overflow-hidden cursor-grab active:cursor-grabbing`}
              style={{
                width: itemWidth,
                height: round ? itemWidth : "100%",
                rotateY: rotateY,
                ...(round && { borderRadius: "50%" }),
              }}
              transition={effectiveTransition}
            >
              <VideoPlay src={item.video} setOnPlay={setIsOnPlay} />
            </motion.div>
          )
        })}
      </motion.div>
      <div className={`flex w-full${round ? "absolute z-20 bottom-12 left-1/2 -translate-x-1/2" : ""}`}>
        <div className="mt-4 flex w-fit gap-x-3">
          {items.map((_, index) => (
            <motion.div
              key={index}
              layoutId="item"
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                currentIndex % items.length === index
                  ? round
                    ? "bg-[#333]"
                    : "bg-[#894444]"
                  : round
                    ? "bg-[#333]"
                    : "bg-[#0D0D0D]"
              }`}
              animate={{
                width: currentIndex % items.length === index ? 45 : 8,
                transformOrigin: "right",
              }}
              onClick={() => setCurrentIndex(index)}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
