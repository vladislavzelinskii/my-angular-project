import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { Product } from '../../models/product';
import firebase from 'firebase/app';
import { CounterCartService } from 'src/app/services/counter-cart.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})

export class ProductDetailComponent implements OnInit {

  product$!: Observable<Product>;
  id!: number;
  flagProductInCart!: boolean;
  quantityOfItemsInCart: number = 0;

  showLoginPopup!: boolean;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private counterCartService: CounterCartService,
  ) { }

  ngOnInit(): void {

    this.route.paramMap.pipe(
      map(params => params.getAll('id'))
    ).subscribe(data => {
      this.id = +data;

      this.product$ = this.firestore.collection('products', ref => {
        return ref.where('id', '==', this.id)
      }).valueChanges().pipe(
        map((item$: any): any => {
          return item$[0];
        }));

      this.firestore.collection('cart').doc(localStorage.cart).valueChanges().pipe(
        map((res: any) => {
          this.flagProductInCart = false;
          this.quantityOfItemsInCart = 0;
          if (res) {
            res.productsInCart.map((element: any) => {
              if (element.productId === this.id) {
                this.flagProductInCart = true;
                this.quantityOfItemsInCart = element.quantity;
              }
            })
          }
        })
      ).subscribe();

    });

  }

  addToCart(productId: number, price: number, name: string, image: string) {
    if (localStorage.cart) {

      const document: any = this.firestore.collection('cart').doc(localStorage.cart);
      document.valueChanges().pipe(
        first(), tap((res: any) => {

          let productsInCart: any = res.productsInCart;
          let flagForNoProductInCart: boolean = true;

          productsInCart = productsInCart.map((element: any) => {
            if (element.productId === productId) {
              element.quantity++;
              flagForNoProductInCart = false;
            }
            return element
          })

          if (flagForNoProductInCart) {
            productsInCart.push({
              productId: productId,
              price: price,
              name: name,
              image: image,
              quantity: 1,
            })
          }

          document.update({
            totalPrice: firebase.firestore.FieldValue.increment(price),
            productsInCart: productsInCart
          });

          this.counterCartService.checkValue();

        })
      ).subscribe();
    } else {
      this.showLogin();
    }
  }

  removeFromCart(productId: number, price: number, name: string, image: string) {
    if (localStorage.cart) {
      const document: any = this.firestore.collection('cart').doc(localStorage.cart);
      this.firestore.collection('cart').doc(localStorage.cart).valueChanges().pipe(
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

          this.counterCartService.checkValue();

        })
      ).subscribe();
      this.quantityOfItemsInCart = 0;
    }
  }

  showLogin() {
    this.showLoginPopup = true;
  }
  closeLogin() {
    this.showLoginPopup = false;
  }
  closeLoginFromChildComponent() {
    this.showLoginPopup = false;
  }

}