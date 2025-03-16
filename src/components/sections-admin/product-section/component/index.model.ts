export interface ProductCarousel{
    id: number;
    image: string;
    button: string;
}

export interface CarouselProps{
    items: ProductCarousel[]
}