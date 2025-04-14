"use client"
import Input from "@/components/organism/form/input/InputField";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useFetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MdOutlineMail } from "react-icons/md";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

type FormValues = z.infer<typeof emailSchema>;


export default function ResetPassword() {
    const { trigger: triggerEmail } = useApi("/api/auth/reset");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(emailSchema),
  });
    
     const onSubmit = async (data: FormValues) => {
        try {
            await triggerEmail(
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: data,
                },
                {
                    onSuccess: () => {
                        alert("Email berhasil dikirim");
                    },
                },
            );
        } catch (error) {
            console.error("Error sending reset password email:", error);
        }
     };
  return (
    <section className="relative min-h-[90vh] w-full grid-cols-2 items-center rounded-xl bg-gradient-to-l from-primary-500 via-primary-50 to-primary-25 p-10 md:grid">
      <h1 className="text-title-md md:text-title-lg">Reset Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        {/* Email Input */}
        <div>
          <Input
            iconLeft={<MdOutlineMail size={20} fontWeight={400} />}
            {...register("email")}
            error={errors.email ? true : false}
            placeholder="Masukkan email"
          />
          {errors.email && (
            <p className="text-sm text-error-500">{errors.email.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" size="sm">
          Submit
        </Button>
      </form>
    </section>
  );
}
