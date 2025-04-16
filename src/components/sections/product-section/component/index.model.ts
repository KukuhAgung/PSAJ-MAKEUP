import {
  productCategory,
} from "@/app/(pages)/product/index.model";

export interface IProductsResponse {
  category: productCategory;
  createdAt: string;
  id: number;
  imageUrl: string;
  updatedAt: string;
}

export interface CarouselProps {
  mobile?: boolean;
  items: IProductsResponse[];
}
