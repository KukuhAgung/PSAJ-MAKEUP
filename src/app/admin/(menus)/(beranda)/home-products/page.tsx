"use client";

import { useState } from "react";
import { HeroSection } from "./(section)/HeroSection";
import { ProductSection } from "./(section)/ProductSection";
import { Products as initialProducts } from "./index.data";
import type { IProductData } from "./index.model";

export default function Product() {
  const [products, setProducts] = useState<IProductData[]>(initialProducts);

  const updateProduct = (updatedProduct: IProductData) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
  };

  return (
    <section className="mr-1 flex w-full -translate-x-5 flex-col items-center gap-y-16 px-4 lg:px-16">
      <div className="w-full max-w-7xl">
        <HeroSection />
      </div>

      {products.map((item) => (
        <div key={item.id} className="w-full max-w-7xl">
          <ProductSection
            data={item}
            onUpdate={(updatedProduct) => updateProduct(updatedProduct)}
          />
        </div>
      ))}
    </section>
  );
}
