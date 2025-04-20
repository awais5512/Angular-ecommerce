import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('@pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('@pages/products-page/products-page.component').then(
        (m) => m.ProductsPageComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('@pages/product-details-page/product-details-page.component').then(
        (m) => m.ProductDetailsPageComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('@pages/cart-page/cart-page.component').then(
        (m) => m.CartPageComponent
      ),
  },
];
