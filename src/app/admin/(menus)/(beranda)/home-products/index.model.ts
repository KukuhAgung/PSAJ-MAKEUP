export interface IProductData {
    id: number
    title: string
    subtitle: string
    banner: string
    description: string
  }
  
  export interface IProductSectionProps {
    data: IProductData
    onUpdate?: (updatedProduct: IProductData) => void
  }
  
  