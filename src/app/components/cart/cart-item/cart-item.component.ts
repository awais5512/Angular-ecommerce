import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '@app/types/cart.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<{
    item: CartItem;
    quantity: number;
  }>();
  @Output() removeItem = new EventEmitter<number>();

  updateQuantity(newQuantity: number): void {
    if (newQuantity < 1) return;
    this.quantityChange.emit({ item: this.item, quantity: newQuantity });
  }

  remove(): void {
    this.removeItem.emit(this.item.id);
  }
}
