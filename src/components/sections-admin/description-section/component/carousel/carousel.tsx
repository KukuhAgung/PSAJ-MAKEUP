"use client";
import type { JSX } from "react";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion, type PanInfo, useMotionValue, useTransform } from "framer-motion";
import type { CarouselProps } from "./index.model";
import VideoPlay from "./component/VideoPlay";
import { carouselData } from "./index.data";

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

export default function Carousel({
  items = carouselData,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
  isAdmin = false,
  onEditVideo,
}: CarouselProps): JSX.Element {
  const containerPadding = 22;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const [videos, setVideos] = useState(items); // ✅ State untuk menyimpan video yang diperbarui
  const carouselItems = loop ? [...videos, videos[0]] : videos;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const x = useMotionValue<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isOnPlay, setIsOnPlay] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered) && !isOnPlay) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === items.length - 1 && loop) {
            return prev + 1;
          }
          if (prev === carouselItems.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, isHovered, isOnPlay, loop, items.length, carouselItems.length, pauseOnHover]);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleVideoChange = (id: number, newSrc: string) => {
    setVideos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, video: newSrc } : item))
    );
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * (carouselItems.length - 1),
          right: 0,
        },
      };

  const handleEditVideo = (id: number) => {
    if (onEditVideo) {
      onEditVideo(id);
    }
  };

  const range = useMemo(
    () =>
      Array.from({ length: carouselItems.length }, (_, i) => [
        -(i + 1) * trackItemOffset,
        -i * trackItemOffset,
        -(i - 1) * trackItemOffset,
      ]),
    [carouselItems.length, trackItemOffset]
  );

  const outputRange = useMemo(
    () => Array.from({ length: carouselItems.length }, () => [90, 0, -90]),
    [carouselItems.length]
  );

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
        {carouselItems.map((item, index) => (
          <CarouselItem
            key={index}
            item={item}
            index={index}
            x={x}
            range={range}
            outputRange={outputRange}
            itemWidth={itemWidth}
            round={round}
            isAdmin={isAdmin}
            handleVideoChange={handleVideoChange}
            handleEditVideo={handleEditVideo}
            setIsOnPlay={setIsOnPlay}
          />
        ))}
      </motion.div>
      <div className="flex w-full mt-4 gap-x-3">
        {items.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
              currentIndex % items.length === index ? "bg-[#894444]" : "bg-[#0D0D0D]"
            }`}
            animate={{
              width: currentIndex % items.length === index ? 45 : 8,
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
  );
}

interface Item {
  id: number;
  video: string;
}

interface CarouselItemProps {
  item: Item;
  index: number;
  x: ReturnType<typeof useMotionValue<number>>;
  range: number[][];
  outputRange: number[][];
  itemWidth: number;
  round: boolean;
  isAdmin: boolean;
  handleVideoChange: (id: number, newSrc: string) => void;
  handleEditVideo: (id: number) => void;
  setIsOnPlay: (isPlaying: boolean) => void;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  item,
  index,
  x,
  range,
  outputRange,
  itemWidth,
  round,
  isAdmin,
  handleVideoChange,
  handleEditVideo,
  setIsOnPlay,
}) => {
  const rotateY = useTransform(x, range[index], outputRange[index], { clamp: false });

  return (
    <motion.div
      className="relative shrink-0 flex flex-col overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        width: itemWidth,
        height: round ? itemWidth : "100%",
        rotateY: rotateY,
        ...(round && { borderRadius: "50%" }),
      }}
      transition={SPRING_OPTIONS}
    >
      <VideoPlay
        src={item.video}
        setOnPlay={setIsOnPlay}
        isAdmin={isAdmin}
        onVideoChange={(newSrc) => handleVideoChange(item.id, newSrc)}
        onEditClick={() => handleEditVideo(item.id)}
      />
    </motion.div>
  );
};