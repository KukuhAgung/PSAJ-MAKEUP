import type React from "react"
export interface VideoProps {
  src: string
  setOnPlay: React.Dispatch<React.SetStateAction<boolean>>
}
