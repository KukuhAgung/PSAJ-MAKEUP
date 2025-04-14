"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ProductCategory } from "../index.data"
import type { productCategory } from "../index.model"

export const MenuSection = () => {
  const router = useRouter()
  const getCategory = useSearchParams().get("name")

  const navigateProduct = (value: productCategory) => {
    // Navigate to the product page with the selected category
    router.push(`/admin/home-products?name=${value.toLowerCase()}`, { scroll: false })
    if (typeof window !== "undefined") {
      localStorage.setItem("category", value.toLowerCase())
    }
  }

  return (
    <section className="productmenu-section">
      <h1 className="z-10 text-center font-jakarta text-[52px] font-semibold text-white">Kategori Produk</h1>
      <article className="z-10 mt-10 flex w-fit items-center justify-center">
        <div className="flex max-w-[70%] flex-wrap justify-center gap-8">
          {ProductCategory.map((item) => (
            <button
              key={item.id}
              value={item.value}
              type="button"
              onClick={() => navigateProduct(item.text)}
              className={`min-h-[32px] min-w-[154px] self-center rounded-sm ${
                getCategory === item.value.toLowerCase() || (!getCategory && item.value.toLowerCase() === "wedding")
                  ? "bg-primary-500 text-white"
                  : "bg-slate-50 text-primary-500"
              } px-4 py-2 text-lg`}
            >
              {item.text}
            </button>
          ))}
        </div>
      </article>
      <div className="absolute left-0 z-1 h-full w-full bg-black bg-opacity-55"></div>
    </section>
  )
}
