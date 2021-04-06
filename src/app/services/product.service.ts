import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  // getProducts(): Observable<Product[]> {
  //   return of(PRODUCTS);
  // }

  // getProduct(id: number): Observable<Product | undefined> {
  //   return of(PRODUCTS.find(product => product.id === id));
  // }

}
