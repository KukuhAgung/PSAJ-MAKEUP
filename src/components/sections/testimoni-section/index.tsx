"use client";
import { useApi } from "@/hooks/useFetchApi";
import { TestimoniCarousel } from "./component/TestimoniCarousel";
import { useEffect, useState } from "react";
import { IResponseAPI } from "@/lib/index.model";
import { IReviewsApiResponse } from "./index.model";
import useMediaQuery from "@/hooks/useMediaQuery";

export const TestimoniSection = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const { trigger } = useApi("/api/user-service/reviews");
  const [reviews, setReviews] = useState<IResponseAPI<IReviewsApiResponse>>();

  useEffect(() => {
    trigger(
      { method: "GET", data: { page: 1, size: 10 } },
      { onSuccess: (data) => setReviews(data) },
    );
  }, []);

  return (
    <section
      id="testimoni"
      className="flex min-h-[90vh] flex-col justify-center gap-y-14 overflow-hidden md:overflow-auto rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20"
    >
      <div className="flex flex-col gap-y-10">
        <h1 className="text-center font-jakarta text-3xl md:text-[56px] font-semibold">
          Testimoni
        </h1>
        <h6 className="text-center font-jakarta text-sm md:text-base font-medium">
          Periksa portofolio dan testimoni dari ratusan kali pengalaman selama
          lebih dari 5 tahun berkarir.
        </h6>
      </div>
      <article className="flex w-full items-center justify-center gap-x-8">
        {reviews && <TestimoniCarousel mobile={mobile} items={reviews.data.reviews} />}
      </article>
    </section>
  );
};
