/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { HeroSection } from "./(section)/HeroSection"
import { MenuSection } from "./(section)/MenuSection"
import { ProductSection } from "./(section)/ProductSection"
import { ResultSection } from "./(section)/ResultSection"
import { Products as initialProducts } from "./index.data"
import type { IProductData } from "./index.model"

export default function Product() {
  const searchParams = useSearchParams()
  const getCategory = searchParams.get("name")

  // State for products from API
  const [products, setProducts] = useState<IProductData[]>(initialProducts)
  const [loading, setLoading] = useState(true)

  // Filter products based on category
  const filteredProducts = getCategory
    ? products.filter((item) => item.title.toLowerCase() === getCategory.toLowerCase())
    : products.filter((item) => item.title.toLowerCase() === "wedding")

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product-service/products")
        const result = await response.json()

        if (result.code === 200 && result.data) {
          // Transform API data to match our model
          const transformedProducts = result.data.map((item: any) => ({
            id: item.id,
            title: item.title as any, // Cast to productCategory type
            subtitle: item.subtitle,
            banner: item.banner,
            description: item.description,
            data: item.galleryItems.map((gallery: any) => ({
              id: gallery.id,
              image: gallery.image,
            })),
          }))

          setProducts(transformedProducts)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [getCategory])

  // Function to update product in state and API
  const updateProduct = async (updatedProduct: IProductData) => {
    try {
      // Update local state first for immediate UI feedback
      setProducts(products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)))

      // Send update to API
      const response = await fetch(`/api/product-service/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subtitle: updatedProduct.subtitle,
          description: updatedProduct.description,
          banner: updatedProduct.banner,
        }),
      })

      const result = await response.json()
      if (result.code !== 200) {
        console.error("Error updating product:", result.message)
      }
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  // Function to update gallery images in state and API
  const updateGalleryImages = async (
    productId: string | number,
    galleryItemId: string | number,
    newImageUrl: string,
  ) => {
    try {
      // Find the product and update the specific gallery item
      const updatedProducts = products.map((product) => {
        if (String(product.id) === String(productId)) {
          const updatedData = product.data.map((item) =>
            String(item.id) === String(galleryItemId) ? { ...item, image: newImageUrl } : item,
          )
          return { ...product, data: updatedData }
        }
        return product
      })

      setProducts(updatedProducts)

      // Send update to API
      const response = await fetch(`/api/product-service/gallery/${galleryItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: newImageUrl,
        }),
      })

      const result = await response.json()
      if (result.code !== 200) {
        console.error("Error updating gallery item:", result.message)
      }
    } catch (error) {
      console.error("Error updating gallery item:", error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <section className="mr-1 flex w-full -translate-x-5 flex-col items-center gap-y-16 px-4 lg:px-16">
      <div className="w-full max-w-7xl">
        <HeroSection />
      </div>

      <div className="w-full max-w-7xl">
        <MenuSection />
      </div>

      {filteredProducts.map((item) => (
        <div key={item.id} className="w-full max-w-7xl">
          <ProductSection data={item} onUpdate={(updatedProduct) => updateProduct(updatedProduct)} />
          <div className="mt-16">
            <ResultSection
              data={item.data}
              productId={item.id}
              onUpdate={(galleryItemId, newImageUrl) => updateGalleryImages(item.id, galleryItemId, newImageUrl)}
            />
          </div>
        </div>
      ))}
    </section>
  )
}
