import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category, ProductService } from '@app/services/product.service';
import { Observable, catchError, map, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent implements OnInit {
  categories$!: Observable<Category[]>;
  selectedCategory: string | null = null;
  searchQuery: string = '';
  isLoading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.productService.getCategories().subscribe({
      next: (response) => {
        this.categories$ = of(response.results || []);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.categories$ = of([]);
        this.isLoading = false;
      },
    });
  }
}
