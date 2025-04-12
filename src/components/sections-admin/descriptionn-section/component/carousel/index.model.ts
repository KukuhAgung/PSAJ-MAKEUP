export interface CarouselItem {
    id: number
    video: string
  }
  
  export interface CarouselProps {
    items?: CarouselItem[]
    baseWidth?: number
    autoplay?: boolean
    autoplayDelay?: number
    pauseOnHover?: boolean
    loop?: boolean
    round?: boolean
    isLoading?: number | null
    showToast: (message: string, type: "success" | "error") => void
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>
    setShowConfirmation : React.Dispatch<React.SetStateAction<number | null>>
  }
  