import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/auth/login`;
  private _isAuthenticated = false;

  constructor(private http: HttpClient) {
    this.initializeAuthFromStorage();
  }

  private initializeAuthFromStorage() {
    const storedToken = localStorage.getItem('authToken');
    this._isAuthenticated = !!storedToken;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<any>(this.authUrl, { username, password }).pipe(
      map((response: AuthResponse) => {
        localStorage.setItem('authToken', response.accessToken);
        this._isAuthenticated = true;
        return response;
      }),
      catchError(({ error }) => {
        this._isAuthenticated = false;
        return throwError(() => new Error(error?.message || 'Login failed'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this._isAuthenticated = false;
  }
}
