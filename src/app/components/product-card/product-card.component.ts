import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '@app/services/cart.service';
import { Product } from '@app/types/product.types';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  cartService = inject(CartService);
  @Input() product!: Product;

  addToCart() {
    this.cartService.addToCart(this.product).subscribe({
      next: (response) => {
        if (response.results) {
          alert('Product added to cart successfully!');
        } else if (response.error) {
          alert('Error adding product to cart: ' + response.error);
        }
      },
      error: (error) => {
        alert('Error adding product to cart: ' + error);
      },
    });
  }
}
