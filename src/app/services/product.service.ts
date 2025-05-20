import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GetProductDetailsResponse,
  GetProductsResponse,
} from '@app/utils/api-responses.types';
import { ApiResponse, wrapApiResponse } from '@app/utils/http.utils';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environment/environment';

export interface Category {
  name: string;
  slug: string;
  url: string;
}

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

  private currentFilterSubject = new BehaviorSubject<ProductFilters>({});
  currentFilter$ = this.currentFilterSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ApiResponse<GetProductsResponse>> {
    const request = this.http.get<GetProductsResponse>(this.baseUrl);
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

  getCategories(): Observable<ApiResponse<Category[]>> {
    const request = this.http.get<Category[]>(`${this.baseUrl}/categories`);
    return wrapApiResponse(request);
  }

  searchProducts(query: string): Observable<ApiResponse<GetProductsResponse>> {
    return this.getProducts();
  }
}
