import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {

  totalPrice!: number;
  productsInCart: any;

  constructor(
    private firestore: AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.firestore.collection('cart').doc(localStorage.cart).valueChanges()
      .pipe(
        take(1),
        map((res: any) => {
          this.totalPrice = res.totalPrice;
          this.productsInCart = res.productsInCart;
        })
      ).subscribe();
  }

}
