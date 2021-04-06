import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductInCart } from 'src/app/models/productInCart';
import { User } from 'src/app/models/user';

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

  constructor(
    private location: Location,
    private firestore: AngularFirestore,
  ) {
    this.item = firestore.collection('usersDetails', ref => {
      return ref.where('id', '==', 0)
    }).valueChanges().pipe(
      map(function (item$: any): any {
        return item$[0];
      }));


    this.productsInCart = firestore.collection('cart').doc('0').valueChanges()
      .pipe(
        map((res: any) => {
          this.totalPrice = res.totalPrice;
          this.productsInCart = res.productsInCart;
        })
      ).subscribe();
  }

  ngOnInit(): void {
  }

  updateName() {
    this.firestore.collection('usersDetails').doc('0').update({ name: this.newName });
  }

  checkout() {
    alert("success");
  }

  goBack() {
    this.location.back()
  }

}
