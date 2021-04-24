import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { ProductInCart } from 'src/app/models/productInCart';
import firebase from 'firebase/app';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  item$!: Observable<any>;
  items: any;
  itemss: any;

  cart!: Cart;
  productInCart!: ProductInCart;

  constructor(
    private firestore: AngularFirestore,
  ) {}

  ngOnInit(): void {
    this.item$ = this.firestore.collection('cart').doc('0').valueChanges();
    console.log(this.item$);
    
  }

  
  quantityMinus(productId: number, quantity: number, productsInCart: ProductInCart[], price: number) {
    this.firestore.collection('cart').doc('0').update({
      totalPrice: firebase.firestore.FieldValue.increment(-price),
      productsInCart: productsInCart.map((element: any) => {
        if (element.productId === productId) {
          element.quantity = quantity - 1;
        }
        return element;
      })
    });
  }

  quantityPlus(productId: number, quantity: number, productsInCart: ProductInCart[], price: number) {
    this.firestore.collection('cart').doc('0').update({
      totalPrice: firebase.firestore.FieldValue.increment(price),
      productsInCart: productsInCart.map((element: any) => {
        if (element.productId === productId) {
          element.quantity = quantity + 1;
        }
        return element;
      })
    });
  }

  deleteProduct(productId: number, price: number, name: string, image: string, quantity: number) {
    this.firestore.collection('cart').doc('0').update({
      totalPrice: firebase.firestore.FieldValue.increment( -(price * quantity)),
      productsInCart: firebase.firestore.FieldValue.arrayRemove({
        productId: productId,
        price: price,
        name: name,
        image: image,
        quantity: quantity,
      })
    });
  }

  clearCart() {
    this.firestore.collection('cart').doc('0').update({
      totalPrice: 0,
      productsInCart: []
    });
  }


}
