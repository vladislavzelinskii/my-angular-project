import { Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { PRODUCTS } from '../mock-products';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  products = PRODUCTS;
  selectedProduct?: Product;
  
  constructor() { }

  ngOnInit(): void {
  }

  onSelect(product: Product): void {
    this.selectedProduct = product;
  }

}
