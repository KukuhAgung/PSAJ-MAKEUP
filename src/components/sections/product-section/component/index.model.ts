import { productCategory } from "@/app/(pages)/product/index.model";

export interface ProductCarousel{
    id: number;
    image: string;
    button: productCategory;
}

export interface CarouselProps{
    items: ProductCarousel[]
}