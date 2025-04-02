export type productCategory =
  | "Wedding"
  | "Graduation"
  | "Party"
  | "Yearbook"
  | "Birthday"
  | "Maternity"
  | "Engangement"
  | "Prewedding";

export interface IResultData {
  id: number;
  image: string;
}


export interface IProductData {
  id: number;
  title: productCategory;
  subtitle: string;
  banner: string;
  description: string;
  data: IResultData[];
}

export interface IProductSectionProps {
  data: IProductData;
}

export interface IProductCategory {
  id: number;
  text: productCategory;
  value: string;
}

export interface IResultSectionProps{
    data: IResultData[];
}

export interface ICarouselProps {
  items: IResultData[];
}
