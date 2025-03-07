export interface IResultData{
    id: number;
    image: string;
}

export interface IResultSectionProps{
    title: string;
    subtitle: string;
    data: IResultData[];
}

export interface ICarouselProps{
    items: IResultData[]
}