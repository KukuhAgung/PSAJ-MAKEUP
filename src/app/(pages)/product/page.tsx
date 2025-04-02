"use client";
import { useSearchParams } from "next/navigation";
import { HeroSection } from "./(section)/HeroSection";
import { MenuSection } from "./(section)/MenuSection";
import { ProductSection } from "./(section)/ProductSection";
import { Products } from "./index.data";
import { useEffect, useState } from "react";
import { IProductData, IResultData } from "./index.model";
import { ResultSection } from "./(section)/ResultSection";

export default function Product() {
  const getCategory = useSearchParams().get("name");
  const data = Products.filter(
    (item) => item.title.toLowerCase() === "wedding",
  );
  const [filteredProducts, setFilteredProducts] =
    useState<IProductData[]>(data);
  const [galleryProducts, setGalleryProducts] = useState<IResultData[]>(
    data[data.length - 1].data,
  );

  useEffect(() => {
    if (getCategory) {
      const filteredProducts = Products.filter(
        (item) => item.title.toLowerCase() === getCategory,
      );
      setFilteredProducts(filteredProducts);
      setGalleryProducts(filteredProducts[filteredProducts.length - 1].data);
    }
  }, [getCategory]);
  return (
    <>
      <HeroSection />
      <MenuSection />
      {/* Render ProductSection berdasarkan data yang difilter */}
      {filteredProducts.map((item) => (
        <ProductSection key={item.id} data={item} />
      ))}
      <ResultSection data={galleryProducts} />
    </>
  );
}
