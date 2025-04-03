import { Carousel } from "../(component)/Carousel";
import { IResultSectionProps } from "../index.model";

export const ResultSection: React.FC<IResultSectionProps> = ({
  data,
}) => {
  return (
    <section className="relative flex min-h-screen flex-col justify-center gap-y-14 overflow-hidden rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20">
      <Carousel items={data} />
      <Carousel items={data} />
    </section>
  );
};
