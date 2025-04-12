"use client"

import type React from "react"
import type { IResultSectionProps } from "../index.model"
import { Carousel } from "../(component)/Carousel"

export const ResultSection: React.FC<IResultSectionProps> = ({ data, productId, onUpdate }) => {
  return (
    <section className="relative flex min-h-screen flex-col justify-center gap-y-14 overflow-hidden rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20">
      <h2 className="text-center font-jakarta text-3xl font-semibold mb-8">Gallery Images</h2>
      <Carousel items={data} productId={productId} onUpdate={onUpdate} />
      <Carousel items={data} productId={productId} onUpdate={onUpdate} />
    </section>
  )
}
