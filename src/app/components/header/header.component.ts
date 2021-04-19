import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  item$: any;

  localStorageLength: any = localStorage.length;

  constructor(
    private firebase: AngularFirestore,
  ) {
    this.item$ = firebase.collection('cart').doc('0').valueChanges()
      .pipe(
        map((res: any) => {
            this.item$ = res.productsInCart;
          }
        )
      ).subscribe();
  }

  ngOnInit(): void {
  }

}
