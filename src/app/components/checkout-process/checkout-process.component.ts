import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BankCard } from 'src/app/models/bankCard';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-checkout-process',
  templateUrl: './checkout-process.component.html',
  styleUrls: ['./checkout-process.component.scss']
})
export class CheckoutProcessComponent implements OnInit {

  user!: Observable<User>;

  productsInCart: any;

  totalPrice!: number;

  showAddressPopup: boolean = false;
  showCardPopup: boolean = false;

  currentBankCard!: BankCard;

  constructor(
    private firestore: AngularFirestore,
  ) {}

  ngOnInit(): void {
    this.user = this.firestore.collection('users', ref => {
      return ref.where('uid', '==', JSON.parse(localStorage.user).uid)
    }).valueChanges().pipe(
      map(function (item$: any): any {
        return item$[0];
      }));

    this.firestore.collection('cart').valueChanges().pipe(
      map((res: any) => {
        res.map((element: any) => {
          if (element.id === localStorage.cart) {
            this.currentBankCard = element.currentCard;
          }
        })
      })
    ).subscribe();

    this.firestore.collection('cart').doc(localStorage.cart).valueChanges()
      .pipe(
        map((res: any) => {
          this.totalPrice = res.totalPrice;
          this.productsInCart = res.productsInCart;
        })
      ).subscribe();
  }

  changeAddress() {
    this.showAddressPopup = true;
  }
  closeAddress() {
    this.showAddressPopup = false;
  }
  closeAddressFromChildComponent(){
    this.showAddressPopup = false;
  }

  changeCard() {
    this.showCardPopup = true;
  }
  closeCard() {
    this.showCardPopup = false;
  }
  closeCardFromChildComponent(){
    this.showCardPopup = false;
  }

}
