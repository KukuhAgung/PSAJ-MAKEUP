"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useFetchApi";
import { IReviews } from "@/components/sections/testimoni-section/index.model";
import { TestimoniCard } from "./component/TestimoniCard";

export default function Testimoni() {
  const { trigger: triggerTestimoni } = useApi("/api/user-service/reviews");
  const [data, setData] = useState<IReviews[]>([]);

  useEffect(() => {
    triggerTestimoni(
      {
        method: "GET",
      },
      {
        onSuccess: (res) => {
          setData(res.data.reviews);
        },
        onError: (err) => {
          console.log(err);
        },
      },
    );
  }, []);

  return (
    <section className="mt-2 flex min-h-[80vh] w-full max-w-[90%] flex-col gap-y-12 self-center bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:max-w-[80%] lg:p-6">
      <h1 className="font-jakarta text-3xl font-semibold">Penilaian Anda</h1>
      <article className="grid grid-cols-4 gap-6 md:max-w-[70%]">
        {data.map((item) => (
          <TestimoniCard
            key={item.id}
            item={item}
          />
        ))}
      </article>
    </section>
  );
}
