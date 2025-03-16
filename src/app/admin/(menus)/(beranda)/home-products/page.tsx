"use client"

import { useState } from "react"
import { HeroSection } from "./(section)/HeroSection"
import { ProductSection } from "./(section)/ProductSection"
import { Products as initialProducts } from "./index.data"
import type { IProductData } from "./index.model"

export default function Product() {
  const [products, setProducts] = useState<IProductData[]>(initialProducts)

  const updateProduct = (updatedProduct: IProductData) => {
    setProducts(products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)))
  }

  return (
    <>
      <HeroSection />
      {products.map((item) => (
        <ProductSection key={item.id} data={item} onUpdate={(updatedProduct) => updateProduct(updatedProduct)} />
      ))}
    </>
  )
}

