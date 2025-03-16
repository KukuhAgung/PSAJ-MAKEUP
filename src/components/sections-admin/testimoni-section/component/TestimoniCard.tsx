import Image from "next/image";

export const TestimoniCard = () => {
  return (
    <div className="flex h-[210px] w-full flex-col gap-y-8 rounded-lg border border-black bg-white p-8">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-x-3">
          <Image
            alt="profile"
            src="/images/product/product-01.png"
            width={500}
            height={500}
            className="h-[60px] w-[60px] rounded-full object-cover"
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-bold">Layla</h1>
            <p className="text-sm text-gray-400">Glow Up Look</p>
          </div>
        </div>
        <h1 className="text-base font-normal">4.5</h1>
      </div>
      <p className="text-base">
        “Sangat memuaskan pokoknya mantul deh hehe.. sukses selalu”
      </p>
    </div>
  );
};
