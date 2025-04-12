"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { HeroSection } from "./(section)/HeroSection"
import { MenuSection } from "./(section)/MenuSection"
import { ProductSection } from "./(section)/ProductSection"
import { ResultSection } from "./(section)/ResultSection"
import type { IProductData, IResultData } from "./index.model"
import { Products as StaticProducts } from "./index.data"

export default function Product() {
  const searchParams = useSearchParams()
  const getCategory = searchParams.get("name")

  const [products, setProducts] = useState<IProductData[]>(StaticProducts)
  const [filteredProducts, setFilteredProducts] = useState<IProductData[]>(
    StaticProducts.filter((item) => item.title.toLowerCase() === "wedding"),
  )
  const [galleryProducts, setGalleryProducts] = useState<IResultData[]>(
    StaticProducts.filter((item) => item.title.toLowerCase() === "wedding")
      .at(-1)?.data || [],
  )
  const [loading, setLoading] = useState(true)

  // Fetch data dari API saat komponen pertama kali mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/product-service/products")
        const result = await response.json()

        if (result.code === 200 && result.data) {
          const transformedProducts: IProductData[] = result.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            banner: item.banner,
            description: item.description,
            data: item.galleryItems.map((gallery: any) => ({
              id: gallery.id,
              image: gallery.image,
            })),
          }))

          setProducts(transformedProducts)

          const currentCategory = (getCategory || "wedding").toLowerCase()
          const filtered = transformedProducts.filter(
            (item) => item.title.toLowerCase() === currentCategory,
          )

          setFilteredProducts(filtered)
          if (filtered.length > 0) {
            setGalleryProducts(filtered.at(-1)!.data)
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Update produk saat kategori berubah
  useEffect(() => {
    if (products.length === 0) return

    const category = (getCategory || "wedding").toLowerCase()
    const filtered = products.filter(
      (item) => item.title.toLowerCase() === category,
    )

    setFilteredProducts(filtered)
    if (filtered.length > 0) {
      setGalleryProducts(filtered.at(-1)!.data)
    }
  }, [getCategory, products])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <>
      <HeroSection />
      <MenuSection />
      {filteredProducts.map((item) => (
        <ProductSection key={item.id} data={item} />
      ))}
      <ResultSection data={galleryProducts} />
    </>
  )
}
