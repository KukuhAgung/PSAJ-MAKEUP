import AnimateButton from "@/components/molecules/animate-button/AnimateButton";
import Image from "next/image";
import { IProductSectionProps } from "../index.model";


export const ProductSection: React.FC<IProductSectionProps> = ({ data }) => {
  return (
    <section className="relative flex min-h-screen flex-col justify-center gap-y-14 rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20">
      <div className="absolute -left-32 -top-16 -z-10 h-[320px] w-[350px] bg-gradient-to-b from-primary-500 to-white opacity-70 blur-[84px]"></div>
      <div className="flex flex-col gap-y-10">
        <h1 className="text-center font-jakarta text-[56px] font-semibold">
          {data.title}
        </h1>
        <h6 className="text-center font-jakarta text-base font-medium">
          {data.subtitle}
        </h6>
      </div>
      <article className="relative grid w-full grid-cols-2 items-center gap-x-20 p-10">
        <Image
          alt="banner"
          loading="lazy"
          src={data.banner}
          width={800}
          height={800}
          className="h-fit w-full object-cover drop-shadow-lg"
        />
        <aside className="flex flex-col justify-center gap-y-9">
          <h1 className="font-jakarta text-title-lg font-medium">
            Pilihan Layanan
          </h1>
          <p className="text-justify font-jakarta text-base font-medium text-black opacity-60">
            {data.description}
          </p>
          {/* <Button size="md" className="w-[180px]" endIcon={(
                    <div className="absolute right-2 w-fit h-fit rounded-full bg-white text-black px-2 py-2"><ArrowRightIcon/></div>
                )}>Lihat Produk</Button> */}
          <AnimateButton>Pesan Sekarang</AnimateButton>
        </aside>
      </article>
       <div className="absolute -right-10 -bottom-60 -z-10 h-[280px] w-[320px] bg-gradient-to-b from-primary-500 to-white opacity-70 blur-[88px]"></div>
    </section>
  );
};
