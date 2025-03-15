"use client";
import { useState } from "react";
import { ArrowRightIcon } from "@/icons";
import Button from "@/components/molecules/button/Button";
import Carousel from "@/components/sections-admin/description-section/component/carousel/carousel";
import { carouselData } from "@/components/sections-admin/description-section/component/carousel/index.data";
import ModalUpload from "@/components/molecules/modal-upload/ModalUpload";

export const DescriptionSection = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  const handleEditVideo = (id: number) => {
    setSelectedVideoId(id);
    setOpenModal(true);
  };

  return (
    <section className="relative min-h-screen w-full grid grid-cols-2 gap-x-20 items-center">
      <aside className="flex items-center justify-center bg-primary-500 bg-opacity-10 border border-white border-opacity-60 rounded-xl px-8 py-10 w-fit h-[80%] relative">
        <Carousel
          items={carouselData}
          baseWidth={480}
          autoplay={true}
          loop={true}
          isAdmin={true}
          onEditVideo={handleEditVideo}
        />
      </aside>

      <article className="flex flex-col gap-y-9 justify-center">
        <h1 className="font-jakarta text-title-lg font-medium">
          Pesona Kecantikan <span className="block">Dalam Setiap</span> Sapuan
        </h1>
        <p className="font-jakarta font-medium text-base text-black opacity-60 text-justify">
          Setiap wajah memiliki keunikan, dan setiap sentuhan riasan membawa cerita tersendiri.
        </p>
        <Button
          size="md"
          className="w-[180px]"
          endIcon={
            <div className="absolute right-2 w-fit h-fit rounded-full bg-white text-black px-2 py-2">
              <ArrowRightIcon />
            </div>
          }
        >
          Lihat Produk
        </Button>
      </article>

      {/* Modal Upload */}
      {openModal && selectedVideoId !== null && (
        <ModalUpload
          videoId={selectedVideoId}
          closeModal={() => setOpenModal(false)}
        />
      )}
    </section>
  );
};
