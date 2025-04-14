import Image from "next/image"
import { PortfolioSectionProps } from "./index.model"

export const PortfolioCard: React.FC<PortfolioSectionProps> = ({ data }) => {
    return (
      <div className="relative flex justify-center">
        <Image
          alt={`portfolio-${data.id}`}
          src={data.image}
          width={400}
          height={400}
          className="min-h-[350px] w-full min-w-[120px] rounded-lg object-center md:w-full md:h-[625px]"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <Image
          alt="logo"
          src="/images/logo/logo-dark.png"
          className="absolute bottom-0"
          width={350}
          height={350}
        />
      </div>
    );
}