import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CART_LOCAL_STORAGE_KEY } from '@app/constants/common.constants';
import { CartItem } from '@app/types/cart.types';
import { Product } from '@app/types/product.types';
import { AddToCartResponse } from '@app/utils/api-responses.types';
import { ApiResponse, wrapApiResponse } from '@app/utils/http.utils';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

export interface CartTotals {
  subtotal: number;
  discount: number;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseURL = 'https://dummyjson.com/carts';
  private localCart = new BehaviorSubject<CartItem[]>(this.getInitialCart());

  cartItems$ = this.localCart.asObservable();
  cartCount$ = this.cartItems$.pipe(map((items) => items.length));
  cartTotals$ = this.cartItems$.pipe(
    map((items) => this.calculateCartTotals(items))
  );

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
    const cartItem: CartItem = this.createCartItemFromProduct(
      product,
      quantity
    );

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
        if (response.results) {
          this.updateLocalCart([cartItem]);
        }
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
        updatedCart[existingIndex] = this.recalculateCartItemTotals(
          updatedCart[existingIndex]
        );
      } else {
        updatedCart.push(this.recalculateCartItemTotals(newItem));
      }
    });

    localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
    this.localCart.next(updatedCart);
  }

  updateCartItemQuantity(productId: number, quantity: number): void {
    const currentCart = this.localCart.getValue();
    const updatedCart = currentCart.map((item) => {
      if (item.id === productId) {
        return this.recalculateCartItemTotals({
          ...item,
          quantity,
        });
      }
      return item;
    });

    localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
    this.localCart.next(updatedCart);
  }

  calculateDiscountedPrice(price: number, discountPercentage: number): number {
    return price * (1 - discountPercentage / 100);
  }

  calculateDiscountedTotal(item: CartItem): number {
    return (
      this.calculateDiscountedPrice(item.price, item.discountPercentage) *
      item.quantity
    );
  }

  calculateDiscountAmount(item: CartItem): number {
    return item.price * item.quantity - this.calculateDiscountedTotal(item);
  }

  createCartItemFromProduct(product: Product, quantity: number = 1): CartItem {
    const subtotal = product.price * quantity;
    const discountedTotal =
      this.calculateDiscountedPrice(product.price, product.discountPercentage) *
      quantity;

    return {
      id: product.id,
      quantity,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      discountPercentage: product.discountPercentage,
      total: subtotal,
      discountedTotal: discountedTotal,
    };
  }

  recalculateCartItemTotals(item: CartItem): CartItem {
    const subtotal = item.price * item.quantity;
    const discountedTotal =
      this.calculateDiscountedPrice(item.price, item.discountPercentage) *
      item.quantity;

    return {
      ...item,
      total: subtotal,
      discountedTotal: discountedTotal,
    };
  }

  calculateCartTotals(items: CartItem[]): CartTotals {
    const totals = items.reduce(
      (acc, item) => {
        const itemSubtotal = item.price * item.quantity;
        const itemDiscount = this.calculateDiscountAmount(item);

        return {
          subtotal: acc.subtotal + itemSubtotal,
          discount: acc.discount + itemDiscount,
          total: acc.total + (itemSubtotal - itemDiscount),
        };
      },
      { subtotal: 0, discount: 0, total: 0 }
    );

    return {
      subtotal: Math.round(totals.subtotal * 100) / 100,
      discount: Math.round(totals.discount * 100) / 100,
      total: Math.round(totals.total * 100) / 100,
    };
  }
}
