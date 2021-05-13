import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormatPipe } from './pipes/format.pipe';

import { AppComponent } from './app.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ProductsComponent } from './components/products/products.component';
import { PopularProductsComponent } from './components/popular-products/popular-products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { FiltersComponent } from './components/filters/filters.component';

import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { CartComponent } from './components/cart/cart.component';
import { HeaderComponent } from './components/header/header.component';
import { CheckoutProcessComponent } from './components/checkout-process/checkout-process.component';
import { CreditCardMaskPipe } from './pipes/bank-card-number.pipe';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { CompareComponent } from './components/compare/compare.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { BankCardFormComponent } from './components/bank-card-form/bank-card-form.component';
import { SearchComponent } from './components/search/search.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { AuthComponent } from './components/auth/auth.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { DatePipe } from '@angular/common';
import { PopupLoginComponent } from './components/popup-login/popup-login.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    ProductsComponent,
    PopularProductsComponent,
    ProductDetailComponent,
    FiltersComponent,
    FormatPipe,
    CreditCardMaskPipe,
    CartComponent,
    HeaderComponent,
    CheckoutProcessComponent,
    ReviewsComponent,
    CompareComponent,
    AddressFormComponent,
    BankCardFormComponent,
    SearchComponent,
    PaymentSuccessComponent,
    AuthComponent,
    UserDetailsComponent,
    PopupLoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
