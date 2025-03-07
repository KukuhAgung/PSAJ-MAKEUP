import { Products } from "./index.data";
import { ProductCarousel } from "./component/ProductCarousel";

export const ProdukSection = () => {
  return (
    <section
      id="product"
      className="relative flex min-h-screen flex-col justify-center gap-y-14 rounded-xl border border-white bg-primary-500 bg-opacity-10 px-10 py-20"
    >
      <div className="absolute -left-[394px] top-[184px] -z-10 h-[350px] w-[435px] bg-gradient-to-b from-primary-500 to-white opacity-70 blur-[88px]"></div>
      <div className="flex flex-col gap-y-10">
        <h1 className="text-center font-jakarta text-[56px] font-semibold">
          Daftar Produk
        </h1>
        <h6 className="text-center font-jakarta text-base font-medium">
          Jelajahi berbagai layanan makeup ekslusif yang dirancang khusus untuk
          memenuhi kebutuhan anda.
        </h6>
      </div>
      <article className="flex flex-col gap-y-4">
        <ProductCarousel items={Products} />
        <p className="text-left font-jakarta text-base font-medium text-primary-500">
          *geser ke kiri untuk menampilkan produk yang lain
        </p>
      </article>
    </section>
  );
};
