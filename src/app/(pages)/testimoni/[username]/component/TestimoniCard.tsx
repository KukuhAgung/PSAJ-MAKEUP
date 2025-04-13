import { ITestimoniCardProps } from "@/components/sections/testimoni-section/index.model";
import { truncateComment } from "@/lib/utils";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import Link from "next/link";

export const TestimoniCard: React.FC<ITestimoniCardProps> = ({ item }) => {

  return (
    <aside className="relative flex h-[180px] w-full min-w-[340px] flex-col gap-y-8 rounded-lg border border-black bg-white p-8">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-x-3">
          {item.user.image !== null ? (
            <Image
              alt="profile"
              src={item.user.image}
              width={500}
              height={500}
              className="h-[60px] w-[60px] rounded-full object-cover"
            />
          ) : (
            <div className="h-[50px] w-[50px] rounded-full bg-[#D9D9D9]"></div>
          )}
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-bold">{item.user.username}</h1>
            <h2 className="text-sm text-gray-400">{item.category}</h2>
          </div>
        </div>
        <div className="flex items-center gap-x-1">
          <FaStar size={20} color="#FBC02D" />
          <h1 className="text-base font-normal">{item.stars}</h1>
        </div>
      </div>
      <p className="text-base">{truncateComment(item.comment, 100)}</p>
      {/* Icon Edit */}
      <Link
        href={`/testimoni/edit/${item.id}`}
        className="absolute right-1 top-1 rounded-full bg-primary-500 p-2 shadow-lg transition hover:bg-primary-700"
      >
        <FaRegEdit size={12} color="white" />
      </Link>
    </aside>
  );
};
