import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { BankCardsComponent } from './components/bank-cards/bank-cards.component';
import { CheckoutProcessComponent } from './components/checkout-process/checkout-process.component';

const routes: Routes = [
  { path: 'products', component: ProductsComponent },
  { path: '', component: MainPageComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'bankCards', component: BankCardsComponent},
  { path: 'checkoutProcess', component: CheckoutProcessComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }