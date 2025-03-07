import Image from "next/image";
import { services } from "./index.data";


export const ServicesSection = () => {
    return (
      <section className="relative flex w-full flex-col items-center justify-center gap-y-14 rounded-xl bg-primary-500 bg-opacity-10 p-10 font-jakarta md:min-h-[55vh]">
        <div className="flex flex-col gap-y-10">
          <h1 className="text-center text-[56px] font-semibold">
            Layanan Kami
          </h1>
          <h6 className="text-base font-medium">
            Pilih layanan Make Up, Hijab DO, Hair DO, paket Make Up untuk tampil
            memukau di setiap momen spesial.
          </h6>
        </div>
        <article className="flex w-full items-center gap-x-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex h-fit w-full items-center gap-x-6"
            >
              <div className="shadow-theme-primary flex h-[115px] w-[160px] items-center justify-center rounded-full bg-white p-4">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={155}
                  height={155}
                  className="h-fit w-fit"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <h1 className="text-title-sm font-bold text-[#0B132A] text-opacity-75">
                  {service.title}
                </h1>
                <p className="text-[15px] font-medium text-gray-500">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </article>
        <Image
          src="/images/shape/product-blur.svg"
          alt="blur-svg"
          width={600}
          height={600}
          className="absolute -bottom-[330px] -right-24 -z-10 h-fit w-fit object-cover blur-[124px] opacity-70"
        />
      </section>
    );
};