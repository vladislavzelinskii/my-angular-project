import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutProcessComponent } from './components/checkout-process/checkout-process.component';
import { CompareComponent } from './components/compare/compare.component';
import { SearchComponent } from './components/search/search.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { AuthComponent } from './components/auth/auth.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

const routes: Routes = [
  { path: 'products', component: ProductsComponent },
  { path: '', component: MainPageComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutProcessComponent},
  { path: 'compare', component: CompareComponent },
  { path: 'search', component: SearchComponent},
  { path: 'paymentSuccess', component: PaymentSuccessComponent },
  { path: 'auth', component: AuthComponent},
  { path: 'userDetails', component: UserDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }