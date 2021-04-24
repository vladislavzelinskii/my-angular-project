import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Review } from 'src/app/models/review';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import firebase from 'firebase/app';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})

export class ProductDetailComponent implements OnInit {

  item!: Observable<Product>;

  review!: Review;

  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location,
    private firestore: AngularFirestore,
  ) {

  }

  id!: number;

  arrayOfStars: any[] = [];
  averageRating: number = 5;

  numberOfReviews: any = 0;

  items: any;
  itemss: any;
  flag: boolean = false;

  ngOnInit(): void {

    // this.id = +this.route.snapshot.params['id'];
    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
    )
      .subscribe(data => {
        this.id = +data;

        this.item = this.firestore.collection('products', ref => {
          return ref.where('id', '==', this.id)
        }).valueChanges().pipe(
          map((item$: any): any => {
            // item$[0].reviews.tap((element: any) => {
            //   this.arrayOfStars.push(element.rating);
            // })
            return item$[0];
          }));

      });

    this.firestore.collection('cart').doc('0').valueChanges().pipe(
      map(res => {
        this.items = res;
        this.flag = false;
        this.items.productsInCart.map((element: any) => {
          if (element.productId === this.id) {
            this.flag = true
          }
        })
      })
    ).subscribe();



    // this.firestore.collection('products').doc(id.toString()).valueChanges().pipe(
    //   first(), tap((res: any) => {

    //     res.reviews.map((element: any) => {
    //         return this.arrayOfStars.push(element.rating);
    //       })

    //   })
    // ).subscribe(x => {
    //   let summRating = this.arrayOfStars.reduce((currentValue: any, previousValue: any) => {
    //     console.log('previousValue: ' + previousValue);
    //     console.log('currentValue: ' + currentValue);
    //     return  previousValue + currentValue;
    //   })
    //   console.log(summRating);
    //   this.averageRating = (summRating)/(this.arrayOfStars.length);
    //   console.log('this.arrayOfStars.length: ' + this.arrayOfStars.length);
    //   console.log(this.averageRating);

    // });





  }

  addToCart(productId: number, price: number, name: string, image: string) {
    this.firestore.collection('cart').doc('0').update({
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
    const document: any = this.firestore.collection('cart').doc('0');
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


  // getProduct(): void {
  //   const id = +this.route.snapshot.params['id'];
  //   this.productService.getProduct(id)
  //     .subscribe(product => this.product = product)
  //   ;

  // }

  // products = PRODUCTS;
  // ngOnInit(): void {
  //   const id = +this.route.snapshot.params['id'];
  //   this.product = this.products.find(product => product.id === id);

  // }

  goBack(): void {
    this.location.back();
  }

}
