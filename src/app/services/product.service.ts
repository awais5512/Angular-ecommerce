import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GetProductDetailsResponse,
  GetProductsResponse,
} from '@app/utils/api-responses.types';
import { ApiResponse, wrapApiResponse } from '@app/utils/http.utils';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environment/environment';

export interface ProductFilters {
  category?: string;
  search?: string;
  limit?: number;
  skip?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${environment.apiUrl}/products`;
  private categoriesCache$?: Observable<ApiResponse<string[]>>;
  private currentFilters = new BehaviorSubject<ProductFilters>({});

  filters$ = this.currentFilters.asObservable();

  constructor(private http: HttpClient) {}

  getProducts(
    filters?: ProductFilters,
    updateCurrentFilters: boolean = true
  ): Observable<ApiResponse<GetProductsResponse>> {
    if (filters && updateCurrentFilters) {
      this.updateFilters(filters);
    }

    const filtersToUse = filters || this.currentFilters.getValue();
    let params = new HttpParams();

    for (const [key, value] of Object.entries(filtersToUse)) {
      switch (key) {
        case 'category':
        case 'search':
        case 'limit':
        case 'skip':
          if (value) {
            params = params.set(key, value.toString());
          }
          break;
        default:
      }
    }

    const request = this.http.get<GetProductsResponse>(this.baseUrl, {
      params,
    });
    return wrapApiResponse(request);
  }

  getProductDetails(
    id: string
  ): Observable<ApiResponse<GetProductDetailsResponse>> {
    const request = this.http.get<GetProductDetailsResponse>(
      `${this.baseUrl}/${id}`
    );
    return wrapApiResponse(request);
  }

  updateFilters(filters: Partial<ProductFilters>): void {
    const currentFilters = this.currentFilters.getValue();
    this.currentFilters.next({ ...currentFilters, ...filters });
  }

  resetFilters(): void {
    this.currentFilters.next({});
  }

  getCategories(): Observable<ApiResponse<string[]>> {
    const request = this.http.get<string[]>(`${this.baseUrl}/categories`);
    return wrapApiResponse(request);
  }

  searchProducts(query: string): Observable<ApiResponse<GetProductsResponse>> {
    return this.getProducts({ search: query });
  }

  getProductsByCategory(
    category: string
  ): Observable<ApiResponse<GetProductsResponse>> {
    return this.getProducts({ category });
  }
}
