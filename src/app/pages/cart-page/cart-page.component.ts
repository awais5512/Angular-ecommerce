import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '@app/services/cart.service';
import { CartItem } from '@app/types/cart.types';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<{
    subtotal: number;
    discount: number;
    total: number;
  }>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;

    this.cartTotal$ = this.cartItems$.pipe(
      map((items) => {
        const totals = items.reduce(
          (acc, item) => {
            const itemSubtotal = item.price * item.quantity;
            const itemDiscount = itemSubtotal * (item.discountPercentage / 100);

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
      })
    );
  }

  ngOnInit(): void {
    // Any initialization logic if needed
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) return;

    const updatedItem: CartItem = {
      ...item,
      quantity: newQuantity,
      total: item.price * newQuantity,
      discountedTotal:
        item.price * newQuantity * (1 - item.discountPercentage / 100),
    };

    this.cartService.updateCartItemQuantity(item.id, newQuantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
