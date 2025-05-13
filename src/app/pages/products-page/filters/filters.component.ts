import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '@app/services/product.service';
import { Observable, map } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent implements OnInit {
  categories$!: Observable<string[]>;
  selectedCategory: string | null = null;
  searchQuery: string = '';
  isLoading = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.categories$ = this.productService.getCategories().pipe(
      map((response) => {
        this.isLoading = false;
        return response.results || [];
      })
    );

    this.productService.filters$.subscribe((filters) => {
      this.selectedCategory = filters.category || null;
    });
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory = category;
    this.productService.updateFilters({
      category: category || undefined,
    });
  }

  search(): void {
    this.productService.updateFilters({
      search: this.searchQuery || undefined,
    });
  }

  resetFilters(): void {
    this.selectedCategory = null;
    this.searchQuery = '';
    this.productService.resetFilters();
  }
}
