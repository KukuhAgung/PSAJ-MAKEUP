"use client";
import Button from "@/components/molecules/button/Button";
import TextArea from "@/components/organism/form/input/TextArea";
import Select from "@/components/organism/form/Select";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSX, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ProductCategory } from "../index.data";
import { FaStar } from "react-icons/fa6";
import {
  FaFaceAngry,
  FaFaceFrown,
  FaFaceMeh,
  FaFaceSmileBeam,
  FaFaceGrinStars,
} from "react-icons/fa6";
import { useApi } from "@/hooks/useFetchApi";

const categoryOptions = [
  "wedding",
  "graduation",
  "party",
  "yearbook",
  "birthday",
  "maternity",
  "engangement",
  "prewedding",
] as const;

const testimoniSchema = z.object({
  category: z.enum(categoryOptions, { required_error: "Pilih kategori" }),
  description: z.string({ required_error: "Deskripsi tidak boleh kosong" }),
  rating: z
    .number({ required_error: "Rating wajib diisi" })
    .min(1, "Rating minimal 1")
    .max(5, "Rating maksimal 5"),
});

type TestimoniFormType = z.infer<typeof testimoniSchema>;

export default function TestimoniAdd() {
  const router = useRouter();
  const { trigger: triggerProfile } = useApi("/api/user-service/getProfile");
  const { trigger: triggerTestimoni } = useApi("/api/user-service/reviews/add");
  const [message, setMessage] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [quota, setQuota] = useState<number>(0);

  const {
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<TestimoniFormType>({
    resolver: zodResolver(testimoniSchema),
  });

  const getRatingMessage = (rating: number): JSX.Element | null => {
    switch (rating) {
      case 1:
        return (
          <p className="text-md ml-2 flex items-center gap-x-3 text-lg font-medium text-red-500">
            Buruk Sekali! <FaFaceAngry size={20} fill="#FF2222" />
          </p>
        );
      case 2:
        return (
          <div className="flex items-center gap-x-3">
            <p className="text-md ml-2 text-lg font-medium text-orange-500">
              Buruk
            </p>
            <div className="flex items-center gap-x-1">
              {[...Array(rating)].map((_, index) => (
                <FaFaceFrown key={index} size={20} fill="#FF7B22" />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center gap-x-3">
            <p className="text-md ml-2 text-lg font-medium text-yellow-500">
              Netral
            </p>
            <div className="flex items-center gap-x-1">
              {[...Array(rating)].map((_, index) => (
                <FaFaceMeh key={index} size={20} fill="#FBC02D" />
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex items-center gap-x-3">
            <p className="text-md ml-2 text-lg font-medium text-green-600">
              Baik
            </p>
            <div className="flex items-center gap-x-1">
              {[...Array(rating)].map((_, index) => (
                <FaFaceSmileBeam key={index} size={20} fill="#00CA18" />
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex items-center gap-x-3">
            <p className="text-md ml-2 text-lg font-medium text-green-500">
              Baik Sekali
            </p>
            <div className="flex items-center gap-x-1">
              {[...Array(rating)].map((_, index) => (
                <FaFaceGrinStars key={index} size={20} fill="#00ED00" />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleSelectChange = (value: string) => {
    setValue("category", value as (typeof categoryOptions)[number]);
  };

  const handleTextareaChange = (value: string) => {
    setMessage(value);
    setValue("description", value);
  };

  const handleSelectStar = (value: number) => {
    setRating(value);
    setValue("rating", value);
  };

  const onSubmit = async (data: TestimoniFormType) => {
    try {
      await triggerTestimoni({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      });
    } catch (error) {
      console.error("Failed to add testimoni:", error);
    }
  };

  useEffect(() => {
   triggerProfile(
     {
       method: "GET",
     },
     {
       onSuccess: (res) => {
         setQuota(res.data.reviewQuota);
       },
       onError: (err) => {
         console.log(err);
       },
     },
   );
  }, [triggerProfile]);

  return (
    <section className="flex min-h-[80vh] w-full max-w-[90%] flex-col items-center justify-center gap-y-12 self-center bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:max-w-[80%] lg:p-6">
      <article className="flex w-full justify-center md:max-w-[70%]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid w-fit grid-cols-1 gap-6">
            {/* Nama Input */}
            <div>
              <div className="flex items-center gap-x-4">
                <Select
                  options={ProductCategory}
                  placeholder="Kategori"
                  defaultValue=""
                  onChange={handleSelectChange}
                  disabled={quota <= 0}
                  className="max-w-[300px] bg-gray-50 dark:bg-gray-800"
                />
              </div>
              {errors.category && (
                <p className="text-sm text-error-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Nama Input */}
            <div>
              <div className="flex items-center gap-x-4">
                <TextArea
                  placeholder="Deskripsi"
                  rows={10}
                  value={message}
                  onChange={handleTextareaChange}
                  disabled={quota <= 0}
                  className="min-w-[400px] bg-gray-50 dark:bg-gray-800 md:min-w-[600px]"
                />
              </div>
              {errors.description && (
                <p className="text-sm text-error-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Rating */}
            {quota <= 0 ? (
              <div className="flex items-center gap-x-4">
                {[...Array(5)].map((_, index) => (
                  <button key={index} type="button" className="cursor-default">
                    <FaStar size={35} fill={"#6b6b6b"} opacity={0.5} />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-x-4">
                {[...Array(5)].map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onMouseEnter={() => {}}
                    onClick={() => handleSelectStar(index + 1)}
                  >
                    <FaStar
                      size={35}
                      fill={index + 1 <= rating ? "#fbbf24" : "#6b6b6b"}
                    />
                  </button>
                ))}

                {/* Rating Message */}
                {rating > 0 && getRatingMessage(rating)}

                {/* Rating Error Message */}
                {errors.rating && (
                  <p className="text-sm text-error-500">
                    {errors.rating.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6 flex items-center gap-x-3">
              <Button
                size="sm"
                variant="outline"
                transparent
                className="w-full min-w-[130px] rounded-none"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="submit"
                disabled={quota <= 0}
                className="w-full min-w-[130px] rounded-none"
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </article>
    </section>
  );
}
