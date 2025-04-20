import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { CartService } from '@app/services/cart.service';
import { UserService } from '@app/services/user.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  cartService = inject(CartService);

  get isAuthenticated() {
    return this.authService.isAuthenticated;
  }

  get userDetails() {
    return this.userService.currentUser;
  }

  get cartItemsLength() {
    return this.cartService.cartItems$.pipe(
      map((cartItems) => {
        return cartItems.length;
      })
    );
  }

  logout() {
    this.authService.logout();
  }
}
