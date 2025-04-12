"use client";
import Button from "@/components/molecules/button/Button";
import Image from "next/image";
import { Rozha_One } from "next/font/google";
import { StarIcon } from "@/icons";
import Avatar from "@/components/molecules/avatar/Avatar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { IResponseAPI } from "@/lib/index.model";
import { IReviewsApiResponse } from "../testimoni-section/index.model";
import { useApi } from "@/hooks/useFetchApi";

const rozha = Rozha_One({
  weight: "400",
  subsets: ["latin"],
});

export const HeroSection = () => {
  const { trigger } = useApi("/api/user-service/reviews");
  const [reviews, setReviews] = useState<IResponseAPI<IReviewsApiResponse>>();
  const [isLoading, setIsLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<string | null>(null);

  // Fetch current hero image on component mount
  useEffect(() => {
    trigger(
      { method: "GET", data: { page: 1, size: 10 } },
      { onSuccess: (data) => setReviews(data) },
    );

    const fetchHeroImage = async () => {
      try {
        const response = await fetch("/api/hero");
        const data = await response.json();

        if (data.code === 200 && data.data) {
          setHeroImage(data.data.imageUrl);
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      } catch (error) {
        console.error("Error fetching hero image:", error);
      }
    };

    fetchHeroImage();
  }, []);

  return (
    <section className="relative grid min-h-[90vh] w-full grid-cols-2 items-center rounded-xl bg-gradient-to-l from-primary-500 via-primary-50 to-primary-25 p-10">
      <div className="absolute -bottom-56 -right-14 -z-10 h-[500px] w-[435px] bg-gradient-to-b from-primary-500 to-white opacity-70 blur-[86px]"></div>
      <article className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-2">
          <p className="text-sm font-medium text-black dark:text-white/90">
            Kami hadir untuk mempercantik hari-hari spesial Anda
          </p>
          <h1
            className={`${rozha.className} text-title-3xl font-bold text-black dark:text-white/90`}
          >
            Spesialis{" "}
            <span className="inline-block text-primary-500">Make Up</span> Kamu
          </h1>
        </div>
        <p className="w-[534px] text-justify font-jakarta text-base font-medium text-black opacity-45 dark:text-white/90">
          Nikmati layanan terbaik untuk kecantikan dan perawatan diri Anda. Kami
          hadir untuk memenuhi kebutuhan Anda dengan produk dan layanan
          berkualitas tinggi.
        </p>
        <div className="flex items-center gap-x-4">
          <Button size="md">Pesan Sekarang</Button>
          <Button size="md" variant="outline" transparent>
            Lihat Selengkapnya
          </Button>
        </div>
        <div className="flex w-fit gap-x-4">
          <div className="flex items-center">
            {reviews?.data.reviews.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className={`relative rounded-full border-2 border-white ${index !== 0 ? "-ml-4" : ""}`}
              >
                {item.user.image !== null ? (
                  <Avatar src={item.user.image} size="xxlarge" />
                ) : (
                  <div className="h-[50px] w-[50px] rounded-full bg-[#D9D9D9]"></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center gap-y-1">
            <div className="flex gap-x-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon key={index} />
              ))}
              {reviews?.data.averageRating}
            </div>
            <p className="text-sm text-black opacity-45 dark:text-white/90">
              from{" "}
              {reviews && reviews.data.totalCount > 5000
                ? "5000+"
                : reviews?.data.totalCount}{" "}
              <Link href="#testimoni" className="font-bold underline">
                reviews
              </Link>
            </p>
          </div>
        </div>
      </article>

      <aside className="flex h-full items-center justify-center">
        <div className="z-1 flex w-[80%] items-center rounded-3xl border border-white border-opacity-60 bg-white bg-opacity-25 px-8 py-10">
          <div className="relative flex w-fit rounded-xl px-8 py-10">
            {/* Shape sebagai Masking */}
            <Image
              priority
              alt="hero-shape"
              src="/images/shape/hero-shape.svg"
              width={420}
              height={420}
              className="mask-image absolute left-0 top-0 h-full w-full drop-shadow-lg"
            />

            {/* Gambar yang akan dimasking */}
            <Image
              priority
              alt="hero-img"
              src={heroImage || "/images/grid-image/hero.png"}
              width={490}
              height={490}
              className="mask-image relative drop-shadow-2xl"
            />

            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </section>
  );
};
