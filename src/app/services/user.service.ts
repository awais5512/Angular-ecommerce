import { Injectable } from '@angular/core';
import { AuthResponse } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userInfo: AuthResponse | null = null;

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        this.userInfo = JSON.parse(userData);
      } catch (error) {
        localStorage.removeItem('userData');
      }
    }
  }

  setUserData(user: AuthResponse): void {
    this.userInfo = user;
    localStorage.setItem('userData', JSON.stringify(user));
  }

  clearUserData(): void {
    this.userInfo = null;
    localStorage.removeItem('userData');
  }

  get currentUser(): AuthResponse | null {
    return this.userInfo;
  }
}
