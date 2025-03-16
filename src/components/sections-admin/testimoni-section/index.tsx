import { TestimoniCarousel } from "./component/TestimoniCarousel"

export const TestimoniSection = () => {
    return (
        <section className="min-h-[90vh] flex flex-col gap-y-14 justify-center rounded-xl bg-primary-500 bg-opacity-10 border border-white px-10 py-20 overflow-hidden">
            <div className="flex flex-col gap-y-10">
                    <h1 className="text-center text-[56px] font-semibold font-jakarta">Testimoni</h1>
                    <h6 className="text-base font-medium font-jakarta text-center">Periksa portofolio dan testimoni dari ratusan kali pengalaman selama lebih dari 5 tahun berkarir.</h6>
            </div>
            <article className="w-full flex items-center justify-center gap-x-8">
                <TestimoniCarousel/>
            </article>
         </section>
    )
}