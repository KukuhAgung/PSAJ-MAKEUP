import { motion } from "framer-motion";
import { useSwiper } from "swiper/react"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { CarouselActionProps } from "../index.model";

export const CarouselAction: React.FC<CarouselActionProps> = ({ activeIndex }) => {
    const swiper = useSwiper()
    
    return (
        <div className="w-full flex items-center justify-between mt-20">
            <div className="flex items-center gap-x-4">
               <div className="flex justify-center items-center gap-2 mt-4">
                {[...Array(2)].map((_, index) => (
                    <motion.div
                        key={index}
                        animate={{ 
                            width: index === activeIndex ? 45 : 10,
                            transformOrigin: "right"
                         }}
                        className={`h-[10px] rounded-full cursor-pointer ${
                            index === activeIndex ? "bg-primary-400" : "bg-black"
                        }`}
                        onClick={() => swiper.slideTo(index)}
                    ></motion.div>
                ))}
            </div>
            </div>
            <div className="flex items-center gap-x-4">
                <button className="w-[45px] h-[45px] flex items-center justify-center bg-primary-400 rounded-full" onClick={() => swiper.slidePrev()}>
                    <FaArrowLeft size={18} color="white"/>
                </button>
                <button className="w-[45px] h-[45px] flex items-center justify-center bg-primary-400 rounded-full" onClick={() => swiper.slideNext()}>
                    <FaArrowRight size={18} color="white"/>
                </button>
            </div>
        </div>
    )
}