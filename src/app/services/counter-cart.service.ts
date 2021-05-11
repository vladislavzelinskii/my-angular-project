import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CounterCartService {

  subject = new BehaviorSubject(0);

  constructor(
    private firebase: AngularFirestore,
  ) { 
    this.checkValue();
  }

  checkValue() {
    if (localStorage.cart) {
      this.firebase.collection('cart').doc(localStorage.cart).valueChanges()
      .pipe(
        take(1),
        map((res: any) => {
            if (res.productsInCart) {
              this.subject.next(res.productsInCart.length);
            }
          }
        )
      ).subscribe();
    }
  }

}
