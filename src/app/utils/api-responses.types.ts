import { Cart, CartItem } from '@app/types/cart.types';
import { Product } from '@app/types/product.types';

// Products API Response Types
export type GetProductsResponse = {
  limit: number;
  products: Product[];
  total: number;
  page: number;
};

export type GetProductDetailsResponse = Product;

// Carts API Response Types
export type GetCartsResponse = {
  carts: Cart[];
  total: 50;
  skip: 0;
  limit: 30;
};

export type AddToCartResponse = {
  id: number;
  products: CartItem[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
};
