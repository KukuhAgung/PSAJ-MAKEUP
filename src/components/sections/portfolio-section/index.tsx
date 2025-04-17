/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Button from "@/components/molecules/button/Button";
import { PortfolioCard } from "../../molecules/portfolio-card";
import { useRouter } from "next/navigation";
import { useNavbar } from "@/context/NavbarContext";
import { useState, useEffect } from "react";
import type { IPortfolioData } from "../../molecules/portfolio-card/index.model";

export const PortfolioSection = () => {
  const { setActiveMenu } = useNavbar();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [portfolioItems, setPortfolioItems] = useState<IPortfolioData[]>([]);

  // Fetch portfolio items on component mount
  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const response = await fetch("/api/portfolio");
        const data = await response.json();

        if (data.code === 200 && data.data) {
          // Map the API data to match our component's expected format
          const mappedPortfolioItems = data.data.map((item: any) => ({
            id: item.id,
            image: item.imageUrl,
          }));
          setPortfolioItems(mappedPortfolioItems);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching portfolio items:", error);
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  const handleRouter = () => {
    router.push("/gallery", { scroll: true });
    setActiveMenu("Galeri");
    if (typeof window !== "undefined") {
      localStorage.setItem("storePath", "Galeri");
    }
  };

  return (
    <section
      id="gallery"
      className="relative flex min-h-screen flex-col items-center justify-center gap-y-10 overflow-hidden rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20 md:gap-y-14"
    >
      <div className="absolute left-56 top-32 -z-10 h-[350px] w-[435px] bg-gradient-to-b from-primary-500 to-white opacity-70 blur-[136px]"></div>
      <div className="flex flex-col gap-y-10">
        <h1 className="text-center font-jakarta text-3xl font-semibold md:text-[56px]">
          Portfolio
        </h1>
        <h6 className="text-center font-jakarta text-sm font-medium md:text-base">
          Periksa portofolio dan testimoni dari ratusan kali pengalaman selama
          lebih dari 5 tahun berkarir.
        </h6>
      </div>
      {loading ? (
        <article className="flex h-[300px] w-full items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
        </article>
      ) : (
        <article className="flex items-center gap-x-2 md:gap-x-8">
          {portfolioItems.map((item) => (
            <PortfolioCard key={item.id} data={item} />
          ))}
        </article>
      )}
      {!loading && (
        <Button onClick={() => handleRouter()}>Lihat Selengkapnya</Button>
      )}
    </section>
  );
};
