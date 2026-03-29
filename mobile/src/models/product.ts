export type ProductPriceUnit = 'dollar' | 'euro' | 'inr';

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  priceUnit: ProductPriceUnit;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  status: boolean;
  data: Product[];
}
