import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '@app/services/cart.service';
import { ProductService } from '@app/services/product.service';
import { Product } from '@app/types/product.types';
import { GetProductDetailsResponse } from '@app/utils/api-responses.types';
import { ApiResponse } from '@app/utils/http.utils';
import { catchError, filter, map, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-details-page',
  imports: [CommonModule],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.css',
})
export class ProductDetailsPageComponent implements OnInit {
  product$!: Observable<ApiResponse<GetProductDetailsResponse>>;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      filter((id) => !!id),
      switchMap((id) => this.productService.getProductDetails(id!)),
      catchError((error) => {
        return of({
          error: 'Failed to load product details',
          results: null,
          isLoading: false,
        });
      })
    );
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1).subscribe({
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
