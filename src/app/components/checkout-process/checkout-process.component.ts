import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductInCart } from 'src/app/models/productInCart';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-checkout-process',
  templateUrl: './checkout-process.component.html',
  styleUrls: ['./checkout-process.component.scss']
})
export class CheckoutProcessComponent implements OnInit {

  item: Observable<User>;
  user?: User | unknown;

  productsInCart: any;
  productInCart!: ProductInCart | unknown;

  totalPrice: any;

  newName!: string;

  showAddressPopup: boolean = false;
  showCardPopup: boolean = false;

  currentBankCard: any;

  constructor(
    private firestore: AngularFirestore,
  ) {
    this.item = firestore.collection('users', ref => {
      return ref.where('uid', '==', JSON.parse(localStorage.user).uid)
    }).valueChanges().pipe(
      map(function (item$: any): any {
        return item$[0];
      }));

    firestore.collection('cart').valueChanges().pipe(
      map((res: any) => {
        res.map((element: any) => {
          if (element.id === localStorage.cart) {
            this.currentBankCard = element.currentCard;
          }
        })
      })
    ).subscribe();

    this.productsInCart = firestore.collection('cart').doc(localStorage.cart).valueChanges()
      .pipe(
        map((res: any) => {
          this.totalPrice = res.totalPrice;
          this.productsInCart = res.productsInCart;
        })
      ).subscribe();
  }

  ngOnInit(): void {
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
