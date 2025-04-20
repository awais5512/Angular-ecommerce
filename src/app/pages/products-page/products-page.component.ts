import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ProductService } from '@services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FiltersComponent } from './filters/filters.component';
import { Product } from '@app/types/product.types';

@Component({
  selector: 'app-products-page',
  imports: [CommonModule, ProductCardComponent, FiltersComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
})
export class ProductsPageComponent implements OnInit {
  products$!: Observable<{
    list: Product[] | null;
    isLoading: boolean;
    error?: string;
  }>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts().pipe(
      map((response) => {
        return {
          list: response.results?.products || null,
          isLoading: response.isLoading,
          error: response.error ?? undefined,
        };
      })
    );
  }
}
