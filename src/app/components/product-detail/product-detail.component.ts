import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

import firebase from 'firebase/app';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})

export class ProductDetailComponent implements OnInit {

  product!: Observable<Product>;
  id!: number;
  flagProductInCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    // private productService: ProductService,
    private location: Location,
    private firestore: AngularFirestore,
  ) {}

  ngOnInit(): void {

    this.route.paramMap.pipe(
      map(params => params.getAll('id'))
    ).subscribe(data => {
        this.id = +data;

        this.product = this.firestore.collection('products', ref => {
          return ref.where('id', '==', this.id)
        }).valueChanges().pipe(
          map((item$: any): any => {
            return item$[0];
          }));

      });
    
    this.firestore.collection('cart').doc(localStorage.cart).valueChanges().pipe(
      map((res: any) => {
        this.flagProductInCart = false;
        if (res) {
          res.productsInCart.map((element: any) => {
            if (element.productId === this.id) {
              this.flagProductInCart = true;
            }
          })
        }
      })
    ).subscribe();

  }

  addToCart(productId: number, price: number, name: string, image: string) {
    this.firestore.collection('cart').doc(localStorage.cart).update({
      totalPrice: firebase.firestore.FieldValue.increment(price),
      productsInCart: firebase.firestore.FieldValue.arrayUnion({
        productId: productId,
        price: price,
        name: name,
        image: image,
        quantity: 1,
      })
    });
  }

  removeFromCart(productId: number, price: number, name: string, image: string) {
    const document: any = this.firestore.collection('cart').doc(localStorage.cart);
    document.valueChanges().pipe(
      first(), tap((res: any) => {

        let quantity!: number;

        res.productsInCart.map((element: any) => {
          if (element.productId === productId) {
            quantity = element.quantity
          }
        })

        document.update({
          totalPrice: firebase.firestore.FieldValue.increment(-(price * quantity)),
          productsInCart: firebase.firestore.FieldValue.arrayRemove({
            productId: productId,
            price: price,
            name: name,
            image: image,
            quantity: quantity
          })
        });
      })
    ).subscribe();

  }

  goBack(): void {
    this.location.back();
  }

}
