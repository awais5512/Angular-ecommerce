import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GetProductDetailsResponse,
  GetProductsResponse,
} from '@app/utils/api-responses.types';
import { ApiResponse, wrapApiResponse } from '@app/utils/http.utils';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${environment.apiUrl}/products`;

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
}
