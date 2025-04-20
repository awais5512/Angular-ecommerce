import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CART_LOCAL_STORAGE_KEY } from '@app/constants/common.constants';
import { CartItem } from '@app/types/cart.types';
import { Product } from '@app/types/product.types';
import { AddToCartResponse } from '@app/utils/api-responses.types';
import { ApiResponse, wrapApiResponse } from '@app/utils/http.utils';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseURL = 'https://dummyjson.com/carts';
  private localCart = new BehaviorSubject<CartItem[]>(this.getInitialCart());

  cartItems$ = this.localCart.asObservable();
  cartCount$ = this.cartItems$.pipe(map((items) => items.length));

  constructor(private httpClient: HttpClient) {}

  private getInitialCart(): CartItem[] {
    try {
      const cart = localStorage.getItem(CART_LOCAL_STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  }

  addToCart(
    product: Product,
    quantity: number = 1
  ): Observable<ApiResponse<AddToCartResponse>> {
    const cartItem: CartItem = {
      id: product.id,
      quantity,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      discountPercentage: product.discountPercentage,
      total: product.price * quantity,
      discountedTotal:
        product.price * quantity * (1 - product.discountPercentage / 100),
    };

    const requestPayload = {
      userId: 1,
      products: [
        {
          id: product.id,
          quantity,
        },
      ],
    };

    const request = this.httpClient.post<AddToCartResponse>(
      `${this.baseURL}/add`,
      requestPayload
    );

    return wrapApiResponse(request).pipe(
      tap((response) => {
        // this.updateLocalCart([cartItem]);
        return response;
      }),
      catchError(({ error }) => {
        return of({
          isLoading: false,
          results: null,
          error: error?.message || 'Failed to add to cart',
        });
      })
    );
  }

  clearCart(): void {
    this.localCart.next([]);
    localStorage.removeItem(CART_LOCAL_STORAGE_KEY);
  }

  removeFromCart(productId: number): void {
    const currentCart = this.localCart.getValue();
    const updatedCart = currentCart.filter((item) => item.id !== productId);
    localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
    this.localCart.next(updatedCart);
  }

  updateLocalCart(cartItems: CartItem[]): void {
    const currentCart = this.localCart.getValue();
    let updatedCart = [...currentCart];

    cartItems.forEach((newItem) => {
      const existingIndex = updatedCart.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingIndex > -1) {
        updatedCart[existingIndex].quantity += newItem.quantity;
        updatedCart[existingIndex].total =
          updatedCart[existingIndex].price *
          updatedCart[existingIndex].quantity;
        updatedCart[existingIndex].discountedTotal =
          updatedCart[existingIndex].total *
          (1 - updatedCart[existingIndex].discountPercentage / 100);
      } else {
        updatedCart.push({
          ...newItem,
          total: newItem.price * newItem.quantity,
          discountedTotal:
            newItem.price *
            newItem.quantity *
            (1 - newItem.discountPercentage / 100),
        });
      }
    });

    localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
    this.localCart.next(updatedCart);
  }

  updateCartItemQuantity(productId: number, quantity: number): void {
    const currentCart = this.localCart.getValue();
    const updatedCart = currentCart.map((item) => {
      if (item.id === productId) {
        return {
          ...item,
          quantity,
          total: item.price * quantity,
          discountedTotal:
            item.price * quantity * (1 - item.discountPercentage / 100),
        };
      }
      return item;
    });

    localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
    this.localCart.next(updatedCart);
  }
}
