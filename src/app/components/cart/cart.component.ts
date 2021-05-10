import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ProductInCart } from 'src/app/models/productInCart';
import firebase from 'firebase/app';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cart!: Observable<any>;
  productInCart!: ProductInCart;

  constructor(
    private firestore: AngularFirestore,
  ) {}

  ngOnInit(): void {
    this.cart = this.firestore.collection('cart').doc(localStorage.cart).valueChanges();
  }
  
  quantityMinus(productId: number, quantity: number, productsInCart: ProductInCart[], price: number) {
    this.firestore.collection('cart').doc(localStorage.cart).update({
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
    this.firestore.collection('cart').doc(localStorage.cart).update({
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
    this.firestore.collection('cart').doc(localStorage.cart).update({
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
    this.firestore.collection('cart').doc(localStorage.cart).update({
      totalPrice: 0,
      productsInCart: [],
    });
  }

}
