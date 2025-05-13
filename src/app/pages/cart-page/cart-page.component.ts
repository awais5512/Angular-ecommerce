import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, CartTotals } from '@app/services/cart.service';
import { CartItem } from '@app/types/cart.types';
import { Observable } from 'rxjs';
import { CartItemComponent } from '@app/components/cart/cart-item/cart-item.component';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule, RouterLink, CartItemComponent],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<CartTotals>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartTotal$ = this.cartService.cartTotals$;
  }

  ngOnInit(): void {
    // Any initialization logic if needed
  }

  updateQuantity(event: {item: CartItem, quantity: number}): void {
    this.cartService.updateCartItemQuantity(event.item.id, event.quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
