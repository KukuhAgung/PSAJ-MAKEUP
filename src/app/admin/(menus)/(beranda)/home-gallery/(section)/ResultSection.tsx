import { Carousel } from "../(component)/Carousel";
import { IResultSectionProps } from "../index.model";

export const ResultSection: React.FC<IResultSectionProps> = ({
  title,
  subtitle,
  data,
}) => {
  return (
    <section className="flex min-h-screen flex-col justify-center gap-y-14 overflow-hidden rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20">
      <div className="flex flex-col gap-y-10">
        <h1 className="text-center font-jakarta text-[56px] font-semibold">
          {title}
        </h1>
        <h6 className="text-center font-jakarta text-base font-medium">
          {subtitle}
        </h6>
      </div>
      <article className="flex flex-col gap-y-4">
        <Carousel items={data} />
        <p className="text-left font-jakarta text-base font-medium text-primary-500">
          *geser ke kiri untuk menampilkan produk yang lain
        </p>
      </article>
    </section>
  );
};
