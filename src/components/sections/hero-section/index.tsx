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
import Alert from "@/components/molecules/alert/Alert";
import { Modal } from "@/components/molecules/modal";

const rozha = Rozha_One({
  weight: "400",
  subsets: ["latin"],
});

export const HeroSection = () => {
  const { trigger } = useApi("/api/user-service/reviews");
  const [showModalError, setShowModalError] = useState(false);
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
    <section className="relative min-h-[90vh] w-full grid-cols-2 items-center rounded-xl bg-gradient-to-l from-primary-500 via-primary-50 to-primary-25 p-10 md:grid">
      <div className="absolute -bottom-64 right-0 -z-10 h-[500px] w-[435px] bg-gradient-to-b from-primary-500 to-white opacity-70 blur-[86px]"></div>
      <article className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-2">
          <p className="text-center text-sm font-medium text-black dark:text-white/90 md:text-left">
            Kami hadir untuk mempercantik hari-hari spesial Anda
          </p>
          <h1
            className={`${rozha.className} text-center text-title-2xl font-bold text-black dark:text-white/90 md:text-left md:text-title-3xl`}
          >
            Spesialis{" "}
            <span className="block text-center text-primary-500 md:inline-block md:text-left">
              Make Up
            </span>{" "}
            Kamu
          </h1>
        </div>
        <p className="text-center font-jakarta text-sm font-medium text-black opacity-45 dark:text-white/90 md:w-[534px] md:text-justify md:text-base">
          Nikmati layanan terbaik untuk kecantikan dan perawatan diri Anda. Kami
          hadir untuk memenuhi kebutuhan Anda dengan produk dan layanan
          berkualitas tinggi.
        </p>
        <div className="flex items-center gap-x-4">
          <Button
            size="md"
            onClick={() => {
              const message = encodeURIComponent(
                "selamat malam ka, saya mau sewa jasa makeup",
              );
              window.open(
                `https://wa.me/6287719606111?text=${message}`,
                "_blank",
              );
            }}
          >
            Pesan Sekarang
          </Button>

          <Button
            size="md"
            variant="outline"
            transparent
            onClick={() => {
              const element = document.getElementById("descriptionSection");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
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
                  <Avatar
                    alt={`profile-${item.user.username}`}
                    src={item.user.image}
                    size="xxlarge"
                  />
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

      <aside className="hidden h-full items-center justify-center md:flex">
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

      <Modal isOpen={showModalError} onClose={() => setShowModalError(false)}>
        <Alert
          variant="error"
          title="Pengambilan Data Gagal"
          message="Terjadi kesalahan saat mengambil data."
        />
      </Modal>
    </section>
  );
};
