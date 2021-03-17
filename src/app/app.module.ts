import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ProductsComponent } from './products/products.component';
import { PopularProductsComponent } from './popular-products/popular-products.component';
import { AppRoutingModule } from './app-routing.module';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { FiltersComponent } from './filters/filters.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    ProductsComponent,
    PopularProductsComponent,
    ProductDetailComponent,
    FiltersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
