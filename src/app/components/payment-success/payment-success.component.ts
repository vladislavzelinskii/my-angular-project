import { DatePipe } from '@angular/common';
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
  purchaseHistory: any = [];
  currentPurchase: any;
  currentDateAndTime: any = new Date();
  currentDate: any;
  currentTime: any;

  constructor(
    private firestore: AngularFirestore,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {

    this.currentDate = this.datePipe.transform(this.currentDateAndTime, 'yyyy-MM-dd');
    this.currentTime = this.datePipe.transform(this.currentDateAndTime, 'HH:mm:ss');

    const cartDocument = this.firestore.collection('cart').doc(localStorage.cart);
    cartDocument.valueChanges()
      .pipe(
        take(1),
        map((res: any) => {
          this.totalPrice = res.totalPrice;
          this.productsInCart = res.productsInCart;

          cartDocument.update({
            productsInCart: [],
            totalPrice: 0
          })

        })
      ).subscribe(() => this.setOrderToPurchaseHistory());
  }

  setOrderToPurchaseHistory() {
    const document = this.firestore.collection('users').doc(JSON.parse(localStorage.user).uid);

    document.valueChanges()
      .pipe(
        take(1),
        map((res: any) => {
          if (res.purchaseHistory) {
            this.purchaseHistory = res.purchaseHistory
          }

          this.currentPurchase = {
            date: this.currentDate,
            time: this.currentTime,
            totalPrice: this.totalPrice,
            products: this.productsInCart,
          }

          this.purchaseHistory.push(this.currentPurchase)
          console.log(this.purchaseHistory);

          document.update({
            purchaseHistory: this.purchaseHistory
          })

        })
      ).subscribe();
  }

}
