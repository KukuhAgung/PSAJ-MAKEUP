export type productCategory =
  | "Wedding"
  | "Graduation"
  | "Party"
  | "Yearbook"
  | "Birthday"
  | "Maternity"
  | "Engangement"
  | "Prewedding"

export interface IResultData {
  id: number
  image: string
}

export interface IProductData {
  id: number
  title: productCategory
  subtitle: string
  banner: string
  description: string
  data: IResultData[]
}

export interface IProductSectionProps {
  data: IProductData
  onUpdate?: (updatedProduct: IProductData) => void
}

export interface IProductCategory {
  id: number
  text: productCategory
  value: string
}

export interface IResultSectionProps {
  data: IResultData[]
  productId: string | number
  onUpdate?: 
    | ((itemId: string | number, imageUrl: string) => void | Promise<void>)
    | ((updatedItems: IResultData[]) => void | Promise<void>)
}

export interface ICarouselItemUpdate {
  (itemId: string | number, imageUrl: string): void | Promise<void>
}

export interface ICarouselProps {
  items: IResultData[]
  onUpdate?: 
    | ICarouselItemUpdate 
    | ((updatedItems: IResultData[]) => void | Promise<void>)
}
