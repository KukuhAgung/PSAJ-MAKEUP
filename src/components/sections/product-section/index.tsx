"use client";
import { ProductCarousel } from "./component/ProductCarousel";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useApi } from "@/hooks/useFetchApi";
import { useEffect, useState } from "react";
import { IProductsResponse } from "./component/index.model";

export const ProdukSection = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const { trigger: triggerProductsData } = useApi("/api/product");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<IProductsResponse[]>();

  useEffect(() => {
    triggerProductsData(
      {
        method: "GET",
      },
      {
        onSuccess: (res) => {
          setProducts(res.data);
          setLoading(false);
        },
      },
    );
  }, []);

  return (
    <section
      id="product"
      className="relative flex min-h-screen flex-col justify-center gap-y-14 rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20"
    >
      <div className="absolute -left-[394px] top-[184px] -z-10 h-[350px] w-[435px] bg-gradient-to-b from-primary-500 to-white opacity-70 blur-[88px]"></div>
      <div className="flex flex-col gap-y-10">
        <h1 className="text-center font-jakarta text-3xl font-semibold md:text-[56px]">
          Daftar Produk
        </h1>
        <h6 className="text-center font-jakarta text-base font-medium">
          Jelajahi berbagai layanan makeup ekslusif yang dirancang khusus untuk
          memenuhi kebutuhan anda.
        </h6>
      </div>
      {loading ? (
        <article className="flex w-full h-[300px] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
        </article>
      ) : (
        <article className="flex flex-col gap-y-4">
          <ProductCarousel mobile={mobile} items={products || []} />
          <p className="text-left font-jakarta text-base font-medium text-primary-500">
            *geser ke kanan untuk menampilkan produk yang lain
          </p>
        </article>
      )}
    </section>
  );
};
