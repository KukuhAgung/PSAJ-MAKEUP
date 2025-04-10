// components/shared/types/description-section.ts

export interface DescriptionSectionData {
  id: string;
  title: string;
  description: string;
  videos: {
    id: string;
    videoUrl: string;
    order: number;
  }[];
}

export interface CarouselItem {
  id: number;
  video: string;
}

export interface VideoProps {
  src: string;
  setOnPlay: (isPlaying: boolean) => void;
  onVideoChange?: (newSrc: string) => void;
  isAdmin?: boolean;
  onEditClick?: () => void;
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
  isAdmin?: boolean;
  onEditVideo?: (id: number) => void;
}