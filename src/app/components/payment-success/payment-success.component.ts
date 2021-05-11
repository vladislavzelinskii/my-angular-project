import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { CounterCartService } from 'src/app/services/counter-cart.service';

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
  currentCard: any;

  constructor(
    private firestore: AngularFirestore,
    private datePipe: DatePipe,
    private router: Router,
    private counterCartService: CounterCartService,
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
          this.currentCard = res.currentCard;

          cartDocument.update({
            productsInCart: [],
            totalPrice: 0
          });

          this.counterCartService.checkValue();

        })
      ).subscribe(() => {
        if (this.productsInCart.length !== 0) {
          this.setOrderToPurchaseHistory();
        } else {
          this.router.navigateByUrl('');
        }
      })

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
            bankCard: this.currentCard,
          }

          this.purchaseHistory.push(this.currentPurchase)

          document.update({
            purchaseHistory: this.purchaseHistory
          })

        })
      ).subscribe();
  }

}
