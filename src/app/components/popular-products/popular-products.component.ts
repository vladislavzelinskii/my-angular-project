import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-popular-products',
  templateUrl: './popular-products.component.html',
  styleUrls: ['./popular-products.component.scss']
})
export class PopularProductsComponent implements OnInit {

  products: Observable<any[]>;

  constructor(firestore: AngularFirestore) {
    this.products = firestore.collection('products', ref => {
      return ref.limit(5);
    }).valueChanges();
  }

  ngOnInit(): void {
  }

}
