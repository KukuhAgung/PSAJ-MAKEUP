import Image from "next/image"
import { PortfolioSectionProps } from "./index.model"

export const PortfolioCard: React.FC<PortfolioSectionProps> = ({ data }) => {
    return (
        <div className="relative flex justify-center">
            <Image alt={`portfolio-${data.id}`} src={data.image} width={400} height={400} className="h-[625px] w-full object-center rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <Image alt="logo" src="/images/logo/logo-dark.png" className="absolute bottom-0" width={350} height={350}/>
        </div>
    )
}